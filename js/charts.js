// Charts, the latest-workout panel and the theme switch

// ---------- Charts: shared helpers ----------
const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const withAlpha = (hex, alpha) => {
    const n = parseInt(hex.replace('#', ''), 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

const escapeHtml = (text) => String(text)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Sport groups for chart colors, in a fixed order: the color follows the group,
// never its position. --series-1..5 are validated for color-blind separation in both themes.
const SPORT_GROUPS = [
    ['racket', ['racket', 'badminton', 'tableTennis', 'squash', 'padel', 'pickleball', 'racquetball', 'tennis']],
    ['walk', ['walking', 'indoorWalking', 'casualWalking', 'speedWalking', 'hiking']],
    ['intervals', ['hiit', 'tabata', 'amrap', 'emom', 'strengthTraining', 'cardioTraining', 'training', 'fitnessEquipment']],
    ['endurance', ['running', 'treadmill', 'indoorRunning', 'trail', 'cycling', 'indoorCycling', 'spin', 'mountain',
        'swimming', 'lapSwimming', 'openWater', 'rowing', 'indoorRowing']],
    ['other', []]
];

function sportGroup(workout) {
    const index = SPORT_GROUPS.findIndex(([, keys]) => keys.includes(workout.sportKey));
    return index === -1 ? SPORT_GROUPS.length - 1 : index;
}

const groupColor = (index) => cssVar(`--series-${index + 1}`);

// Heart rate zones as a share of max heart rate
const HR_ZONES = [
    { key: 'zone.rest', min: 0, max: 0.5, cls: 'zone-rest', color: '#4a5568' },
    { key: 'zone.warmup', min: 0.5, max: 0.6, cls: 'zone-warmup', color: '#6366f1' },
    { key: 'zone.fat', min: 0.6, max: 0.7, cls: 'zone-fat', color: '#10b981' },
    { key: 'zone.aerobic', min: 0.7, max: 0.8, cls: 'zone-aerobic', color: '#f59e0b' },
    { key: 'zone.anaerobic', min: 0.8, max: 0.9, cls: 'zone-anaerobic', color: '#ef4444' },
    { key: 'zone.max', min: 0.9, max: 1.0, cls: 'zone-max', color: '#b91c1c' }
];

const zoneMaxHR = () => (userProfile.age ? calculateMaxHR(userProfile.age) : 190);

// A pulse at or above the max heart rate still counts as the top zone
function hrZoneIndex(hr, maxHR = zoneMaxHR()) {
    const share = hr / maxHR;
    const index = HR_ZONES.findIndex(zone => share >= zone.min && share < zone.max);
    return index === -1 ? HR_ZONES.length - 1 : index;
}

// Thin reference line for the average (its value is in the legend)
const averageLinePlugin = {
    id: 'averageLine',
    afterDatasetsDraw(chart, args, options) {
        if (options.value == null) return;
        const { ctx, chartArea, scales } = chart;
        const y = scales.y.getPixelForValue(options.value);
        ctx.save();
        ctx.strokeStyle = cssVar('--text-secondary');
        ctx.globalAlpha = 0.7;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(chartArea.left, y);
        ctx.lineTo(chartArea.right, y);
        ctx.stroke();
        ctx.restore();
    }
};

// Heart rate zones as tinted horizontal bands behind the line
const zoneBandsPlugin = {
    id: 'zoneBands',
    beforeDatasetsDraw(chart) {
        const { ctx, chartArea, scales } = chart;
        const maxHR = zoneMaxHR();
        ctx.save();
        HR_ZONES.forEach(zone => {
            const top = Math.max(scales.y.getPixelForValue(zone.max * maxHR), chartArea.top);
            const bottom = Math.min(scales.y.getPixelForValue(zone.min * maxHR), chartArea.bottom);
            if (bottom <= top) return;
            ctx.fillStyle = withAlpha(zone.color, 0.1);
            ctx.fillRect(chartArea.left, top, chartArea.right - chartArea.left, bottom - top);
            if (bottom - top > 14) {
                ctx.fillStyle = cssVar('--text-dim');
                ctx.font = "600 11px 'Manrope', sans-serif";
                ctx.textAlign = 'left';
                ctx.fillText(t(zone.key), chartArea.left + 8, top + 14);
            }
        });
        ctx.restore();
    }
};

function updateCharts() {
    // Destroy existing charts
    Object.values(charts).forEach(chart => chart.destroy());
    charts = {};

    const grid = cssVar('--grid');
    const dim = cssVar('--text-dim');
    // Oldest -> newest, last 30
    const chartWorkouts = [...workoutsData].sort((a, b) => a.date - b.date).slice(-30);
    const labels = chartWorkouts.map(w => formatDate(w.date, { month: 'short', day: 'numeric' }));

    // Workout dynamics: one bar per workout, height = duration, color = sport group
    const minutes = chartWorkouts.map(w => Math.round(w.duration / 60));
    const average = Math.round(minutes.reduce((a, b) => a + b, 0) / (minutes.length || 1));
    const groups = [...new Set(chartWorkouts.map(sportGroup))].sort((a, b) => a - b);
    const groupLegend = groups.length > 1
        ? groups.map(i => `<span class="legend-item"><span class="legend-dot" style="background: ${groupColor(i)}"></span>${t('group.' + SPORT_GROUPS[i][0])}</span>`).join('')
        : '';
    document.getElementById('dynamicsLegend').innerHTML = groupLegend
        + `<span class="legend-item legend-avg"><span class="legend-line"></span>${t('chart.average', { v: average })}</span>`;

    charts.workouts = new Chart(document.getElementById('workoutsChart'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: t('chart.duration'),
                data: minutes,
                backgroundColor: chartWorkouts.map(w => groupColor(sportGroup(w))),
                borderRadius: { topLeft: 4, topRight: 4 },
                borderSkipped: 'start',
                maxBarThickness: 24
            }]
        },
        plugins: [averageLinePlugin],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                averageLine: { value: average },
                tooltip: {
                    displayColors: false,
                    callbacks: {
                        title: (items) => {
                            const w = chartWorkouts[items[0].dataIndex];
                            const date = formatDate(w.date, { day: 'numeric', month: 'long', year: 'numeric' });
                            return `${date} · ${sportName(w)}`;
                        },
                        label: (item) => {
                            const w = chartWorkouts[item.dataIndex];
                            const lines = [
                                `⏱️ ${item.raw} ${t('unit.min')}`,
                                `🔥 ${Math.round(w.calories)} ${t('unit.kcal')}`,
                                `💓 ${w.avgHeartRate} ${t('unit.bpm')}` + (w.minHeartRate ? ` ${t('chart.hrRange', { min: w.minHeartRate, max: w.maxHeartRate })}` : '')
                            ];
                            if (w.trainingEffect != null) {
                                lines.push(`🎯 ${t('badge.effect')} ${formatNumber(w.trainingEffect, 1)}` + (w.anaerobicTrainingEffect != null ? ` / ${formatNumber(w.anaerobicTrainingEffect, 1)}` : ''));
                            }
                            if (w.trainingLoad != null) {
                                lines.push(`📊 ${t('badge.load')} ${w.trainingLoad}`);
                            }
                            return lines;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: t('unit.min'), color: dim },
                    ticks: { color: dim, maxTicksLimit: 5 },
                    grid: { color: grid },
                    border: { display: false }
                },
                x: {
                    ticks: { color: dim, maxRotation: 0, autoSkipPadding: 12 },
                    grid: { display: false },
                    border: { color: grid }
                }
            }
        }
    });

    // Heart rate: average per workout over the zone bands
    const heartRates = chartWorkouts.map(w => w.avgHeartRate);
    const hrColor = cssVar('--series-hr');
    charts.heartRate = new Chart(document.getElementById('heartRateChart'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: t('chart.avgHr'),
                data: heartRates,
                borderColor: hrColor,
                borderWidth: 2,
                tension: 0.35,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: hrColor,
                pointBorderColor: cssVar('--bg-card'),
                pointBorderWidth: 2
            }]
        },
        plugins: [zoneBandsPlugin],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    displayColors: false,
                    callbacks: {
                        label: (item) => `💓 ${item.raw} ${t('unit.bpm')} · ${t(HR_ZONES[hrZoneIndex(item.raw)].key)}`
                    }
                }
            },
            scales: {
                y: {
                    suggestedMin: Math.min(...heartRates) - 12,
                    suggestedMax: Math.max(...heartRates) + 12,
                    ticks: { color: dim, maxTicksLimit: 5 },
                    grid: { display: false },
                    border: { display: false }
                },
                x: {
                    ticks: { color: dim, maxRotation: 0, autoSkipPadding: 12 },
                    grid: { display: false },
                    border: { color: grid }
                }
            }
        }
    });
}

// Latest workout: headline numbers and the heart rate trace colored by zone
function renderLastWorkout() {
    const panel = document.getElementById('lastWorkout');
    const workout = workoutsData[0]; // workoutsData is sorted newest first
    if (charts.lastHr) {
        charts.lastHr.destroy();
        delete charts.lastHr;
    }
    if (!workout) {
        panel.style.display = 'none';
        return;
    }
    panel.style.display = '';

    const date = formatDate(workout.date, { weekday: 'long', day: 'numeric', month: 'long' });
    const time = workout.date.toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit' });
    document.getElementById('lastEyebrow').textContent = `${t('last.title')} · ${date}, ${time}`;
    document.getElementById('lastTitle').innerHTML =
        `<span class="last-icon">${sportIcon(workout)}</span>${escapeHtml(sportName(workout))}`;

    const stat = (value, unit, label) => `
        <div class="stat">
            <div class="stat-value">${value}${unit ? `<span>${unit}</span>` : ''}</div>
            <div class="stat-label">${label}</div>
        </div>`;
    document.getElementById('lastStats').innerHTML = [
        stat(Math.round(workout.duration / 60), t('unit.min'), t('chart.duration')),
        stat(Math.round(workout.calories), t('unit.kcal'), t('progress.calories')),
        workout.avgHeartRate ? stat(workout.avgHeartRate, t('unit.bpm'), t('last.avgMax', { max: workout.maxHeartRate })) : '',
        workout.trainingEffect != null ? stat(formatNumber(workout.trainingEffect, 1), '', t('badge.effect')) : '',
        workout.trainingLoad != null ? stat(workout.trainingLoad, '', t('badge.load')) : ''
    ].join('');

    // Average the samples into at most 240 points: minutes from the start -> bpm
    const samples = (workout.trackPoints || []).filter(p => p.heartRate > 0 && p.time);
    const start = samples.length ? samples[0].time.getTime() : 0;
    const buckets = Math.min(240, samples.length);
    const trace = [];
    for (let b = 0; b < buckets; b++) {
        const slice = samples.slice(Math.floor(b * samples.length / buckets), Math.floor((b + 1) * samples.length / buckets));
        if (slice.length === 0) continue;
        trace.push({
            x: (slice[0].time.getTime() - start) / 60000,
            y: Math.round(slice.reduce((sum, p) => sum + p.heartRate, 0) / slice.length)
        });
    }

    const hasTrace = trace.length > 1;
    panel.querySelector('.last-chart').style.display = hasTrace ? 'block' : 'none';
    document.getElementById('lastZones').style.display = hasTrace ? 'flex' : 'none';
    document.getElementById('lastZoneLegend').style.display = hasTrace ? 'flex' : 'none';
    if (!hasTrace) return;

    const dim = cssVar('--text-dim');
    const grid = cssVar('--grid');
    charts.lastHr = new Chart(document.getElementById('lastHrChart'), {
        type: 'line',
        data: {
            datasets: [{
                data: trace,
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.3,
                fill: 'start',
                backgroundColor: withAlpha(cssVar('--series-hr'), 0.08),
                segment: { borderColor: (ctx) => HR_ZONES[hrZoneIndex(ctx.p1.parsed.y)].color }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: {
                    displayColors: false,
                    callbacks: {
                        title: (items) => `${Math.round(items[0].parsed.x)} ${t('unit.min')}`,
                        label: (item) => `💓 ${item.parsed.y} ${t('unit.bpm')} · ${t(HR_ZONES[hrZoneIndex(item.parsed.y)].key)}`
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    ticks: { color: dim, stepSize: 15, callback: (value) => `${value}′` },
                    grid: { display: false },
                    border: { color: grid }
                },
                y: {
                    ticks: { color: dim, maxTicksLimit: 5 },
                    grid: { color: grid },
                    border: { display: false }
                }
            }
        }
    });

    // Time in zones for this workout
    const maxHR = zoneMaxHR();
    const counts = HR_ZONES.map(() => 0);
    (workout.heartRates || []).forEach(hr => counts[hrZoneIndex(hr, maxHR)]++);
    const total = counts.reduce((a, b) => a + b, 0) || 1;
    document.getElementById('lastZones').innerHTML = counts.map((count, i) => count === 0 ? '' :
        `<span class="lz" style="flex: ${count}; background: ${HR_ZONES[i].color}" title="${t(HR_ZONES[i].key)}: ${Math.round(count / total * 100)}%"></span>`
    ).join('');
    document.getElementById('lastZoneLegend').innerHTML = counts.map((count, i) => count === 0 ? '' :
        `<span class="legend-item"><span class="legend-dot" style="background: ${HR_ZONES[i].color}"></span>${t(HR_ZONES[i].key)} <b>${Math.round(count / total * 100)}%</b></span>`
    ).join('');
}

// ---------- Theme ----------
function syncThemeButton() {
    const light = document.documentElement.dataset.theme === 'light';
    const button = document.getElementById('themeBtn');
    button.textContent = light ? '🌙' : '☀️';
    button.title = t(light ? 'theme.toDark' : 'theme.toLight');
    button.setAttribute('aria-label', button.title);
}

function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try {
        localStorage.setItem('appTheme', theme);
    } catch (e) {
        // not critical: the choice just will not be remembered
    }
    syncThemeButton();
    // Chart colors are read from the theme when the charts are drawn
    if (workoutsData.length > 0) {
        updateCharts();
        renderLastWorkout();
    }
}
