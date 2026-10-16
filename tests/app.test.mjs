// Browser tests: open the real page, upload the synthetic files from fixtures/
// and check what the app parsed and shows. Run with `npm test` in this folder.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const testsDir = fileURLToPath(new URL('.', import.meta.url));
const siteDir = join(testsDir, '..');
const fixture = (name) => join(testsDir, 'fixtures', name);

const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript' };
let server;
let baseUrl;
let browser;

before(async () => {
    server = createServer(async (req, res) => {
        const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([/\\])+/, '');
        try {
            const body = await readFile(join(siteDir, path || 'index.html'));
            res.writeHead(200, { 'Content-Type': TYPES[extname(path)] || 'application/octet-stream' });
            res.end(body);
        } catch {
            res.writeHead(404);
            res.end();
        }
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch();
});

after(async () => {
    await browser?.close();
    server?.close();
});

// The page loads Chart.js, the FIT SDK and fonts from CDNs: serve the first two
// from node_modules so the tests run offline, skip the fonts.
async function openApp({ locale = 'ru-RU', colorScheme = 'dark' } = {}) {
    const context = await browser.newContext({ locale, colorScheme });
    const page = await context.newPage();
    const problems = [];
    page.on('pageerror', error => problems.push(`page error: ${error.message}`));
    page.on('dialog', async dialog => {
        problems.push(`dialog: ${dialog.message()}`);
        await dialog.dismiss();
    });
    await page.route(/cdn\.jsdelivr\.net\/npm\/chart\.js@4\.4\.0\//, route => route.fulfill({
        contentType: 'application/javascript',
        path: join(testsDir, 'node_modules/chart.js/dist/chart.umd.js')
    }));
    await page.route(/cdn\.jsdelivr\.net\/npm\/@garmin\/fitsdk@21\.217\.0\/(.*)/, route => {
        const file = new URL(route.request().url()).pathname.split('@21.217.0/')[1];
        return route.fulfill({
            contentType: 'application/javascript',
            path: join(testsDir, 'node_modules/@garmin/fitsdk', file)
        });
    });
    await page.route(/fonts\.(googleapis|gstatic)\.com/, route => route.abort());
    await page.goto(`${baseUrl}/index.html`);
    return { page, context, problems };
}

async function upload(page, names) {
    await page.setInputFiles('#fileInput', names.map(fixture));
    await page.waitForFunction(count => document.querySelectorAll('.workout-item').length >= count, names.length > 3 ? 3 : 1);
}

const workouts = (page) => page.evaluate(() => workoutsData.map(w => ({
    date: w.date.toISOString(),
    sport: w.sport,
    sportKey: w.sportKey,
    minutes: Math.round(w.duration / 60),
    calories: Math.round(w.calories),
    source: w.source || 'xml',
    trainingEffect: w.trainingEffect ?? null,
    trainingLoad: w.trainingLoad ?? null,
    heartRates: w.heartRates.length
})));

test('parses TCX, GPX and FIT and keeps the FIT copy of a duplicate workout', async () => {
    const { page, context, problems } = await openApp();
    await upload(page, ['badminton.tcx', 'badminton.fit', 'interval-no-id.tcx', 'walk.gpx']);
    const list = await workouts(page);

    assert.equal(list.length, 3, 'the TCX and FIT badminton files are one workout');
    const [badminton, interval, walk] = list; // newest first
    assert.deepEqual(
        { date: badminton.date, sportKey: badminton.sportKey, minutes: badminton.minutes, calories: badminton.calories, source: badminton.source },
        { date: '2026-09-23T18:00:00.000Z', sportKey: 'badminton', minutes: 60, calories: 650, source: 'fit' }
    );
    assert.equal(badminton.trainingEffect, 3.8);
    assert.equal(badminton.trainingLoad, 180);
    assert.ok(badminton.heartRates > 300, 'heart rate samples from the FIT records');

    assert.equal(interval.date, '2026-09-21T07:30:00.000Z', 'no <Id>: the date comes from the lap');
    assert.equal(interval.sportKey, 'hiit', 'Zepp "<category> <type>" name resolves to the type');

    assert.equal(walk.sportKey, 'walking');
    assert.equal(walk.minutes, 45);
    assert.ok(walk.heartRates > 0, 'heart rate from the GPX extension');

    assert.deepEqual(problems, []);
    await context.close();
});

test('English and Estonian show no Russian text', async () => {
    const { page, context, problems } = await openApp();
    await upload(page, ['badminton.fit', 'interval-no-id.tcx', 'walk.gpx']);
    // the "loaded N workouts" toast was shown in Russian before the switch
    await page.evaluate(() => document.querySelectorAll('.notification').forEach(n => n.remove()));
    for (const lang of ['en', 'et']) {
        await page.click(`.lang-btn[data-lang="${lang}"]`);
        const text = await page.evaluate(() => document.body.innerText + ' '
            + [...document.querySelectorAll('[title], [placeholder]')].map(e => `${e.title} ${e.placeholder || ''}`).join(' '));
        assert.deepEqual(text.match(/[Ѐ-ӿ]+/g) || [], [], `Cyrillic left in ${lang}`);
        assert.equal(await page.evaluate(() => document.documentElement.lang), lang);
    }
    assert.deepEqual(problems, []);
    await context.close();
});

test('an unreadable file shows an error notification instead of a browser dialog', async () => {
    const { page, context, problems } = await openApp();
    await page.setInputFiles('#fileInput', { name: 'broken.tcx', mimeType: 'application/xml', buffer: Buffer.from('not a workout') });
    const note = page.locator('.notification.error');
    await note.waitFor();
    assert.match(await note.textContent(), /Не удалось загрузить файлы/);
    assert.deepEqual(problems, [], 'no alert() dialog');
    await context.close();
});

test('language and theme choices survive a reload', async () => {
    const { page, context, problems } = await openApp({ locale: 'ru-RU', colorScheme: 'dark' });
    assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'dark', 'theme follows the OS on the first visit');
    await page.click('.lang-btn[data-lang="et"]');
    await page.click('#themeBtn');
    await page.reload();
    assert.equal(await page.evaluate(() => currentLang), 'et');
    assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'light');
    assert.equal(await page.textContent('h1'), 'TERVISETRÄKER');
    assert.deepEqual(problems, []);
    await context.close();
});
