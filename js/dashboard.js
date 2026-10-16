// Summary cards, workout history, recommendations, heart rate zones, weekly progress, benchmarks

function updateDashboard() {
    // Update summary cards
    const totalWorkouts = workoutsData.length;
    const totalCalories = workoutsData.reduce((sum, w) => sum + w.calories, 0);
    const totalTime = workoutsData.reduce((sum, w) => sum + w.duration, 0);
    const avgHeartRate = Math.round(
        workoutsData.reduce((sum, w) => sum + w.avgHeartRate, 0) / totalWorkouts
    );

    document.getElementById('totalWorkouts').textContent = totalWorkouts;
    document.getElementById('totalCalories').textContent = formatNumber(totalCalories);
    document.getElementById('avgHeartRate').textContent = avgHeartRate || '--';
    document.getElementById('totalTime').textContent = `${Math.round(totalTime / 3600)}${t('unit.h')}`;

    // Update workouts list
    updateWorkoutsList();

    // Update charts
    updateCharts();
    renderLastWorkout();
    document.body.classList.add('has-data');

    // Show containers
    document.getElementById('chartsContainer').style.display = '';
    document.getElementById('heartRateContainer').style.display = '';

    // Show clear button
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.style.display = 'inline-block';
    }

    // Reset file input to allow re-uploading same files
    fileInput.value = '';
}

function updateWorkoutsList() {
    const listContainer = document.getElementById('workoutsList');
    listContainer.innerHTML = `<div class="chart-title">${t('history.title')}</div>`;

    workoutsData.forEach(workout => {
        const item = document.createElement('div');
        item.className = 'workout-item';

        const dateStr = formatDate(workout.date, {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const duration = Math.round(workout.duration / 60);
        const distance = formatNumber(workout.distance / 1000, 2);

        const name = escapeHtml(sportName(workout));
        const effect = workout.trainingEffect != null
            ? formatNumber(workout.trainingEffect, 1)
                + (workout.anaerobicTrainingEffect != null ? ` / ${formatNumber(workout.anaerobicTrainingEffect, 1)}` : '')
            : null;

        item.innerHTML = `
            <div class="workout-date">
                <span title="${name}">${sportIcon(workout)}</span> ${dateStr}
                <span style="color: var(--text-dim); font-weight: normal;">· ${name}</span>
            </div>
            <div class="workout-stats">
                <span class="stat-badge">⏱️ ${duration} ${t('unit.min')}</span>
                <span class="stat-badge">🔥 ${Math.round(workout.calories)} ${t('unit.kcal')}</span>
                <span class="stat-badge">💓 ${workout.avgHeartRate} ${t('unit.bpm')}</span>
                ${workout.minHeartRate ? `<span class="stat-badge" title="${t('badge.minHrTitle')}">📉 ${t('badge.min')} ${workout.minHeartRate} ${t('unit.bpm')}</span>` : ''}
                ${effect ? `<span class="stat-badge" title="${t('badge.effectTitle')}">🎯 ${t('badge.effect')} ${effect}</span>` : ''}
                ${workout.trainingLoad != null ? `<span class="stat-badge" title="${t('badge.loadTitle')}">📊 ${t('badge.load')} ${workout.trainingLoad}</span>` : ''}
                ${workout.distance > 0 ? `<span class="stat-badge">📍 ${distance} ${t('unit.km')}</span>` : ''}
            </div>
        `;

        listContainer.appendChild(item);
    });
}

function generateInsights() {
    console.log('generateInsights() called');
    const insightsContainer = document.getElementById('insights');
    const insightsContent = document.getElementById('insightsContent');
    insightsContent.innerHTML = '';

    const insights = analyzeHealth();
    console.log('Generated', insights.length, 'insights');

    insights.forEach(insight => {
        const item = document.createElement('div');
        item.className = 'insight-item';
        item.innerHTML = `
            <div class="insight-icon">${insight.icon}</div>
            <div class="insight-content">
                <h4>${insight.title}</h4>
                <p>${insight.text}</p>
            </div>
        `;
        insightsContent.appendChild(item);
    });

    if (insights.length > 0) {
        insightsContainer.style.display = 'block';
        insightsContainer.style.visibility = 'visible';
        console.log('Insights container shown');
    } else {
        console.warn('No insights generated!');
    }
}

function analyzeHealth() {
    const insights = [];
    const totalWorkouts = workoutsData.length;

    if (totalWorkouts === 0) return insights;

    const avgHeartRate = Math.round(
        workoutsData.reduce((sum, w) => sum + w.avgHeartRate, 0) / totalWorkouts
    );
    const totalCalories = workoutsData.reduce((sum, w) => sum + w.calories, 0);
    const avgCaloriesPerWorkout = Math.round(totalCalories / totalWorkouts);
    const totalTime = workoutsData.reduce((sum, w) => sum + w.duration, 0);

    // Анализ частоты тренировок
    const daysBetween = (workoutsData[0].date - workoutsData[totalWorkouts - 1].date) / (1000 * 60 * 60 * 24);
    const workoutsPerWeek = (totalWorkouts / daysBetween) * 7;

    if (workoutsPerWeek >= 3) {
        insights.push({
            icon: '✅',
            title: t('ins.regular.title'),
            text: t('ins.regular.text', { n: formatNumber(workoutsPerWeek, 1) })
        });
    } else if (workoutsPerWeek >= 2) {
        insights.push({
            icon: '⚠️',
            title: t('ins.moreOften.title'),
            text: t('ins.moreOften.text', { n: formatNumber(workoutsPerWeek, 1) })
        });
    } else {
        insights.push({
            icon: '❗',
            title: t('ins.irregular.title'),
            text: t('ins.irregular.text')
        });
    }

    // Анализ пульса с учетом профиля
    if (userProfile.age) {
        const maxHR = calculateMaxHR(userProfile.age);
        const avgHRPercent = (avgHeartRate / maxHR * 100).toFixed(0);

        if (avgHRPercent >= 70 && avgHRPercent <= 85) {
            insights.push({
                icon: '💚',
                title: t('ins.hrOptimal.title'),
                text: t('ins.hrOptimal.text', { hr: avgHeartRate, pct: t('ins.hrPct', { pct: avgHRPercent }) })
            });
        } else if (avgHRPercent > 85) {
            insights.push({
                icon: '🔴',
                title: t('ins.hrHigh.title'),
                text: t('ins.hrHigh.text', { hr: avgHeartRate, pct: t('ins.hrPct', { pct: avgHRPercent }) })
            });
        } else {
            insights.push({
                icon: '💙',
                title: t('ins.hrModerate.title'),
                text: t('ins.hrModerate.text', { hr: avgHeartRate, pct: t('ins.hrPct', { pct: avgHRPercent }) })
            });
        }
    } else {
        // Без профиля - базовый анализ
        if (avgHeartRate >= 140 && avgHeartRate <= 160) {
            insights.push({
                icon: '💚',
                title: t('ins.hrOptimal.title'),
                text: t('ins.hrOptimal.text', { hr: avgHeartRate, pct: '' })
            });
        } else if (avgHeartRate > 160) {
            insights.push({
                icon: '🔴',
                title: t('ins.hrHigh.title'),
                text: t('ins.hrHigh.text', { hr: avgHeartRate, pct: '' })
            });
        } else {
            insights.push({
                icon: '💙',
                title: t('ins.hrModerate.title'),
                text: t('ins.hrModerate.text', { hr: avgHeartRate, pct: '' })
            });
        }
    }

    // Анализ калорий с учетом веса
    if (userProfile.weight) {
        const caloriesPerKg = avgCaloriesPerWorkout / userProfile.weight;
        if (caloriesPerKg >= 6) {
            insights.push({
                icon: '🔥',
                title: t('ins.energyHigh.title'),
                text: t('ins.energyHigh.text', { kcal: avgCaloriesPerWorkout, perKg: t('ins.perKg', { v: formatNumber(caloriesPerKg, 1) }) })
            });
        } else {
            insights.push({
                icon: '💡',
                title: t('ins.energyGrow.title'),
                text: t('ins.energyGrow.text', { kcal: avgCaloriesPerWorkout, perKg: t('ins.perKg', { v: formatNumber(caloriesPerKg, 1) }) })
            });
        }
    } else {
        // Без профиля - базовый анализ
        if (avgCaloriesPerWorkout >= 400) {
            insights.push({
                icon: '🔥',
                title: t('ins.energyHigh.title'),
                text: t('ins.energyHigh.text', { kcal: avgCaloriesPerWorkout, perKg: '' })
            });
        } else {
            insights.push({
                icon: '💡',
                title: t('ins.energyGrow.title'),
                text: t('ins.energyGrow.text', { kcal: avgCaloriesPerWorkout, perKg: '' })
            });
        }
    }

    // Рекомендации по восстановлению
    const avgDuration = totalTime / totalWorkouts / 60;
    if (avgDuration > 60) {
        insights.push({
            icon: '😴',
            title: t('ins.recovery.title'),
            text: t('ins.recovery.text', { min: Math.round(avgDuration) })
        });
    }

    // ИМТ рекомендации
    if (userProfile.weight && userProfile.height) {
        const bmi = calculateBMI(userProfile.weight, userProfile.height);
        const category = getBMICategory(bmi);
        const bmiText = formatNumber(bmi, 1);
        const categoryName = t(`bmi.${category}`);

        if (category === 'normal') {
            insights.push({
                icon: '⚖️',
                title: t('ins.bmiNormal.title'),
                text: t('ins.bmiNormal.text', { bmi: bmiText })
            });
        } else if (category === 'over' || category === 'obese') {
            insights.push({
                icon: '🎯',
                title: t('ins.bmiLose.title'),
                text: t('ins.bmiLose.text', { bmi: bmiText, category: categoryName })
            });
        } else if (category === 'under') {
            insights.push({
                icon: '🍽️',
                title: t('ins.bmiGain.title'),
                text: t('ins.bmiGain.text', { bmi: bmiText, category: categoryName })
            });
        }
    }

    // Гидратация
    if (avgCaloriesPerWorkout > 300) {
        const waterNeeded = Math.round((avgDuration / 15) * 200);
        insights.push({
            icon: '💧',
            title: t('ins.water.title'),
            text: t('ins.water.text', { ml: waterNeeded })
        });
    }

    // Питание
    if (avgCaloriesPerWorkout > 400) {
        insights.push({
            icon: '🍽️',
            title: t('ins.postMeal.title'),
            text: t('ins.postMeal.text', { kcal: avgCaloriesPerWorkout })
        });
    }

    if (avgDuration > 45) {
        insights.push({
            icon: '🥗',
            title: t('ins.preMeal.title'),
            text: t('ins.preMeal.text', { min: Math.round(avgDuration) })
        });
    }

    return insights;
}

// Heart Rate Zones Analysis
function analyzeHeartRateZones() {
    console.log('analyzeHeartRateZones called, workouts:', workoutsData.length);
    if (workoutsData.length === 0) {
        console.log('No workouts, skipping HR zones');
        return;
    }

    const maxHR = userProfile.age ? calculateMaxHR(userProfile.age) : 190;
    console.log('Max HR:', maxHR, 'Age:', userProfile.age);

    const zones = HR_ZONES.map(zone => ({ name: t(zone.key), min: zone.min, max: zone.max, color: zone.cls, time: 0 }));

    // Calculate time in each zone
    let totalPoints = 0;
    workoutsData.forEach(workout => {
        if (workout.heartRates && workout.heartRates.length > 0) {
            workout.heartRates.forEach(hr => {
                totalPoints++;
                zones[hrZoneIndex(hr, maxHR)].time++;
            });
        }
    });

    if (totalPoints === 0) return;

    // Create visualization
    const zoneBar = document.getElementById('zoneBar');
    const zoneLegend = document.getElementById('zoneLegend');

    zoneBar.innerHTML = '';
    zoneLegend.innerHTML = '';

    zones.forEach(zone => {
        const percentage = (zone.time / totalPoints * 100);

        if (percentage > 0) {
            // Bar segment
            const segment = document.createElement('div');
            segment.className = `zone-segment ${zone.color}`;
            segment.style.width = `${percentage}%`;
            // a share too narrow for its label is still in the legend below
            segment.textContent = percentage >= 7 ? `${percentage.toFixed(0)}%` : '';
            segment.title = `${zone.name}: ${percentage.toFixed(1)}%`;
            zoneBar.appendChild(segment);
        }

        // Legend item
        const item = document.createElement('div');
        item.className = 'zone-item';
        item.innerHTML = `
            <div class="zone-color ${zone.color}"></div>
            <div class="zone-info">
                <div class="zone-name">${zone.name}</div>
                <div class="zone-range">${Math.round(zone.min * maxHR)}-${Math.round(zone.max * maxHR)} ${t('unit.bpm')}</div>
                <div class="zone-time">${t('zone.timeShare', { pct: formatNumber(percentage, 1) })}</div>
            </div>
        `;
        zoneLegend.appendChild(item);
    });

    document.getElementById('hrZones').style.display = 'block';
    console.log('HR Zones displayed with', zones.length, 'zones');
}

// Weekly Progress Analysis
function analyzeWeeklyProgress() {
    console.log('analyzeWeeklyProgress called, workouts:', workoutsData.length);
    if (workoutsData.length < 2) {
        console.log('Not enough workouts for weekly progress (need at least 2)');
        return null;
    }

    // Group workouts by week
    const weekGroups = {};
    workoutsData.forEach(workout => {
        const weekStart = new Date(workout.date);
        // Set to Monday of the week (European standard)
        const day = weekStart.getDay();
        const diff = (day === 0 ? -6 : 1) - day; // Monday = 1, Sunday = 0 -> -6
        weekStart.setDate(weekStart.getDate() + diff);
        weekStart.setHours(0, 0, 0, 0);
        const weekKey = weekStart.toISOString().split('T')[0];

        if (!weekGroups[weekKey]) {
            weekGroups[weekKey] = [];
        }
        weekGroups[weekKey].push(workout);
    });

    const weeks = Object.keys(weekGroups).sort().reverse().slice(0, 4);
    if (weeks.length < 2) {
        console.log('Not enough weeks for comparison, need at least 2 different weeks');
        return null;
    }

    console.log('Weeks found:', weeks);
    console.log('Week groups:', weekGroups);

    const weekStats = weeks.map(weekKey => {
        const workouts = weekGroups[weekKey];
        return {
            week: weekKey,
            count: workouts.length,
            totalCalories: workouts.reduce((sum, w) => sum + w.calories, 0),
            avgHeartRate: workouts.reduce((sum, w) => sum + w.avgHeartRate, 0) / workouts.length,
            totalTime: workouts.reduce((sum, w) => sum + w.duration, 0) / 3600
        };
    });

    return weekStats;
}

function displayWeeklyProgress() {
    console.log('displayWeeklyProgress called');
    const weekStats = analyzeWeeklyProgress();
    if (!weekStats) {
        console.log('No week stats returned, skipping weekly progress');
        return;
    }

    console.log('Week stats:', weekStats);
    const progressGrid = document.getElementById('progressGrid');
    progressGrid.innerHTML = `<div class="chart-title" style="grid-column: 1/-1;">${t('progress.title')}</div>`;

    // This week vs last week
    const thisWeek = weekStats[0];
    const lastWeek = weekStats[1];

    const metrics = [
        {
            title: t('progress.workouts'),
            current: thisWeek.count,
            previous: lastWeek.count,
            unit: t('unit.times', { n: thisWeek.count }),
            format: (v) => Math.round(v)
        },
        {
            title: t('progress.calories'),
            current: thisWeek.totalCalories,
            previous: lastWeek.totalCalories,
            unit: t('unit.kcal'),
            format: (v) => Math.round(v)
        },
        {
            title: t('progress.avgHr'),
            current: thisWeek.avgHeartRate,
            previous: lastWeek.avgHeartRate,
            unit: t('unit.bpm'),
            format: (v) => Math.round(v)
        },
        {
            title: t('progress.time'),
            current: thisWeek.totalTime,
            previous: lastWeek.totalTime,
            unit: t('unit.h'),
            format: (v) => formatNumber(v, 1)
        }
    ];

    metrics.forEach(metric => {
        const change = ((metric.current - metric.previous) / metric.previous * 100);
        const trend = change > 5 ? 'up' : change < -5 ? 'down' : 'stable';
        const trendIcon = change > 5 ? '📈' : change < -5 ? '📉' : '➡️';

        const card = document.createElement('div');
        card.className = 'progress-card';
        card.innerHTML = `
            <div class="progress-title">${t('progress.thisWeek', { title: metric.title })}</div>
            <div class="progress-value">${metric.format(metric.current)}<span style="font-size: 1.5rem; color: var(--text-dim);"> ${metric.unit}</span></div>
            <div class="progress-trend ${trend}">${trendIcon} ${t('progress.vsLast', { change: `${change > 0 ? '+' : ''}${change.toFixed(0)}` })}</div>
        `;
        progressGrid.appendChild(card);
    });

    progressGrid.style.display = '';
}

// Benchmarks and Comparisons
function displayBenchmarks() {
    console.log('displayBenchmarks() called, workouts:', workoutsData.length);
    if (workoutsData.length === 0) {
        console.log('No workouts, skipping benchmarks');
        return;
    }

    const benchmarksContent = document.getElementById('benchmarksContent');
    benchmarksContent.innerHTML = '';
    console.log('Benchmarks content cleared, generating...');

    // Personal bests
    const maxCalories = Math.max(...workoutsData.map(w => w.calories));
    const maxDuration = Math.max(...workoutsData.map(w => w.duration));

    // Recent averages (last 5 workouts)
    const recent = workoutsData.slice(0, Math.min(5, workoutsData.length));
    const recentAvgCalories = recent.reduce((sum, w) => sum + w.calories, 0) / recent.length;
    const recentAvgDuration = recent.reduce((sum, w) => sum + w.duration, 0) / recent.length;

    const benchmarks = [
        {
            label: t('bench.calories'),
            current: Math.round(recentAvgCalories),
            best: Math.round(maxCalories),
            unit: t('unit.kcal')
        },
        {
            label: t('bench.duration'),
            current: Math.round(recentAvgDuration / 60),
            best: Math.round(maxDuration / 60),
            unit: t('unit.min')
        }
    ];

    // Age-based benchmarks if profile exists
    if (userProfile.age) {
        const avgCaloriesForAge = userProfile.age < 30 ? 500 : userProfile.age < 50 ? 450 : 400;

        benchmarks.push({
            label: t('bench.ageCalories'),
            current: Math.round(recentAvgCalories),
            best: avgCaloriesForAge,
            unit: t('unit.kcal'),
            isComparison: true
        });
    }

    benchmarks.forEach(benchmark => {
        const percentage = (benchmark.current / benchmark.best * 100);
        const card = document.createElement('div');
        card.className = 'benchmark-card';

        const comparison = benchmark.isComparison 
            ? t('bench.ageAvg', { value: `${benchmark.best} ${benchmark.unit}` })
            : t('bench.best', { value: `${benchmark.best} ${benchmark.unit}` });

        card.innerHTML = `
            <div class="benchmark-header">
                <div class="benchmark-label">${benchmark.label}</div>
                <div style="font-weight: 700; color: var(--accent-primary);">${benchmark.current} ${benchmark.unit}</div>
            </div>
            <div class="benchmark-bar">
                <div class="benchmark-fill" style="width: ${Math.min(percentage, 100)}%">
                    <div class="benchmark-value">${percentage.toFixed(0)}%</div>
                </div>
            </div>
            <div class="benchmark-comparison">${comparison}</div>
        `;
        benchmarksContent.appendChild(card);
    });

    // Forecast
    if (workoutsData.length >= 4) {
        const forecast = generateForecast();
        if (forecast) {
            const forecastCard = document.createElement('div');
            forecastCard.className = 'benchmark-card';
            forecastCard.style.background = 'rgba(0, 255, 136, 0.05)';
            forecastCard.style.borderColor = 'var(--accent-primary)';
            forecastCard.innerHTML = `
                <div class="benchmark-header">
                    <div class="benchmark-label">${t('bench.forecast')}</div>
                </div>
                <div style="color: var(--text-secondary); line-height: 1.6; margin-top: 0.5rem;">
                    ${forecast}
                </div>
            `;
            benchmarksContent.appendChild(forecastCard);
        }
    }

    document.getElementById('benchmarksSection').style.display = '';
    console.log('Benchmarks section displayed');
}

function generateForecast() {
    if (workoutsData.length < 4) return null;

    // Calculate trends
    const recentHalf = workoutsData.slice(0, Math.floor(workoutsData.length / 2));
    const olderHalf = workoutsData.slice(Math.floor(workoutsData.length / 2));

    const recentAvgCalories = recentHalf.reduce((sum, w) => sum + w.calories, 0) / recentHalf.length;
    const olderAvgCalories = olderHalf.reduce((sum, w) => sum + w.calories, 0) / olderHalf.length;

    const caloriesTrend = ((recentAvgCalories - olderAvgCalories) / olderAvgCalories * 100);

    const recentFrequency = recentHalf.length;
    const olderFrequency = olderHalf.length;

    let forecast = '';

    if (caloriesTrend > 10) {
        const projectedCalories = Math.round(recentAvgCalories * 1.15);
        forecast += t('forecast.growth', { value: `<strong style="color: var(--accent-primary);">${projectedCalories} ${t('unit.kcal')}</strong>` });
    } else if (caloriesTrend < -10) {
        forecast += t('forecast.decline');
    } else {
        forecast += t('forecast.stable');
    }

    if (recentFrequency > olderFrequency) {
        forecast += t('forecast.moreOften');
    }

    const monthlyCalories = Math.round(recentAvgCalories * recentFrequency * 4);
    forecast += t('forecast.monthly', { value: `<strong style="color: var(--accent-primary);">${formatNumber(monthlyCalories)} ${t('unit.kcal')}</strong>` });

    return forecast;
}
