# Tests

Browser tests for the health tracker. They open the real page in headless
Chromium, upload the synthetic workout files from `fixtures/` and check what
the app parsed and shows: TCX / GPX / FIT parsing, duplicate handling, the
three languages, error notifications, and remembered language and theme.

```bash
cd tests
npm install
npx playwright install chromium   # once, downloads the browser
npm test
```

Chart.js and the Garmin FIT SDK are served from `node_modules` during the
tests, so no internet connection is needed once installed.

`fixtures/` holds made-up workouts, no real person's data. To regenerate them
(for example after changing `make-fixtures.mjs`): `npm run fixtures`.
