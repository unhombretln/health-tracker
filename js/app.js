// App state, profile, file upload and the page startup.
// Loaded last: the startup at the bottom calls functions from all the other files.

let workoutsData = [];
let charts = {};
let userProfile = {
    age: null,
    gender: null,
    weight: null,
    height: null
};

// Load profile from localStorage
function loadProfile() {
    const saved = localStorage.getItem('badmintonProfile');
    if (saved) {
        try {
            userProfile = JSON.parse(saved);
            console.log('Profile loaded:', userProfile);
        } catch (e) {
            console.error('Error loading profile:', e);
        }
    }
}

// Save profile to localStorage
function saveProfile() {
    localStorage.setItem('badmintonProfile', JSON.stringify(userProfile));
    console.log('Profile saved:', userProfile);
}

// Calculate BMI
function calculateBMI(weight, height) {
    if (!weight || !height) return null;
    const heightM = height / 100;
    return (weight / (heightM * heightM)).toFixed(1);
}

// Calculate max heart rate
function calculateMaxHR(age) {
    if (!age) return null;
    return Math.round(220 - age);
}

// Get BMI category
function getBMICategory(bmi) {
    if (bmi < 18.5) return 'under';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'over';
    return 'obese';
}

// Notification system
function showNotification(message, type = 'info', duration = 3000) {
    // Notifications stack in one column instead of covering each other
    let stack = document.getElementById('notificationStack');
    if (!stack) {
        stack = document.createElement('div');
        stack.id = 'notificationStack';
        stack.className = 'notification-stack';
        document.body.appendChild(stack);
    }
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    stack.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Upload handling
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');

uploadZone.addEventListener('click', () => fileInput.click());

uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = 'var(--accent-primary)';
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.style.borderColor = 'var(--border-color)';
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = 'var(--border-color)';
    // Some apps (e.g. Telegram Desktop with several files) drop links instead of files
    if (e.dataTransfer.files.length === 0) {
        showNotification(t('notify.dropNoFiles'), 'info', 5000);
        return;
    }
    handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

// Clear data button
const clearBtn = document.getElementById('clearBtn');
const confirmModal = document.getElementById('confirmModal');
const modalCancel = document.getElementById('modalCancel');
const modalConfirm = document.getElementById('modalConfirm');

if (clearBtn) {
    clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Clear button clicked - showing modal');

        // Show custom modal instead of browser confirm
        confirmModal.classList.add('active');
    });
    console.log('Clear button listener attached successfully');
} else {
    console.error('Clear button not found!');
}

// Modal cancel button
modalCancel.addEventListener('click', () => {
    console.log('User cancelled clear');
    confirmModal.classList.remove('active');
});

// Click outside modal to close
confirmModal.addEventListener('click', (e) => {
    if (e.target === confirmModal) {
        console.log('User clicked outside - closing modal');
        confirmModal.classList.remove('active');
    }
});

// Modal confirm button - actually clear the data
modalConfirm.addEventListener('click', () => {
    console.log('User confirmed clear - starting data clear');
    confirmModal.classList.remove('active');

    try {
        // Clear data
        workoutsData = [];
        fileInput.value = '';
        console.log('Data arrays cleared');

        // Destroy charts
        if (charts && Object.keys(charts).length > 0) {
            Object.values(charts).forEach(chart => {
                if (chart && chart.destroy) {
                    chart.destroy();
                }
            });
            charts = {};
            console.log('Charts destroyed');
        }

        // Reset UI
        document.getElementById('totalWorkouts').textContent = '0';
        document.getElementById('totalCalories').textContent = '0';
        document.getElementById('avgHeartRate').textContent = '--';
        document.getElementById('totalTime').textContent = `0${t('unit.h')}`;
        console.log('Stats reset');

        // Hide sections
        ['lastWorkout', 'chartsContainer', 'heartRateContainer', 'insights', 'hrZones', 'progressGrid', 'benchmarksSection']
            .forEach(id => { document.getElementById(id).style.display = 'none'; });
        document.body.classList.remove('has-data');
        clearBtn.style.display = 'none';
        console.log('Sections hidden');

        // Reset workouts list
        renderEmptyWorkoutsList();
        console.log('Workout list reset');

        showNotification(t('notify.cleared'), 'info');
        console.log('Data cleared successfully');
    } catch (error) {
        console.error('Error during clear:', error);
        alert(t('alert.clearError', { error: error.message }));
    }
});

// Profile modal
const profileBtn = document.getElementById('profileBtn');
const profileModal = document.getElementById('profileModal');
const profileCancel = document.getElementById('profileCancel');
const profileSave = document.getElementById('profileSave');
const profileForm = document.getElementById('profileForm');

profileBtn.addEventListener('click', () => {
    console.log('Opening profile modal');
    // Load current profile data into form
    document.getElementById('age').value = userProfile.age || '';
    document.getElementById('gender').value = userProfile.gender || '';
    document.getElementById('weight').value = userProfile.weight || '';
    document.getElementById('height').value = userProfile.height || '';

    updateProfileStats();
    profileModal.classList.add('active');
});

profileCancel.addEventListener('click', () => {
    profileModal.classList.remove('active');
});

profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) {
        profileModal.classList.remove('active');
    }
});

// Update profile stats in real-time
profileForm.addEventListener('input', updateProfileStats);

function updateProfileStats() {
    const age = parseInt(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseInt(document.getElementById('height').value);

    const profileStats = document.getElementById('profileStats');

    if (weight && height) {
        const bmi = calculateBMI(weight, height);
        document.getElementById('bmiValue').textContent = bmi;
        profileStats.style.display = 'grid';
    } else {
        profileStats.style.display = 'none';
    }

    if (age) {
        const maxHr = calculateMaxHR(age);
        document.getElementById('maxHrValue').textContent = maxHr;
        profileStats.style.display = 'grid';
    }
}

profileSave.addEventListener('click', () => {
    const age = parseInt(document.getElementById('age').value) || null;
    const gender = document.getElementById('gender').value || null;
    const weight = parseFloat(document.getElementById('weight').value) || null;
    const height = parseInt(document.getElementById('height').value) || null;

    userProfile = { age, gender, weight, height };
    saveProfile();

    profileModal.classList.remove('active');
    showNotification(t('notify.profileSaved'), 'info');

    // Regenerate insights with new profile data
    if (workoutsData.length > 0) {
        generateInsights();
    }
});

async function handleFiles(files) {
    if (files.length === 0) return;

    document.getElementById('loading').classList.add('active');

    // Don't reset workoutsData, append to existing data
    const newWorkouts = [];

    for (let file of files) {
        try {
            let workout;
            if (file.name.toLowerCase().endsWith('.fit')) {
                // FIT is binary
                workout = await parseFIT(await file.arrayBuffer());
            } else {
                // TCX and GPX are XML text files
                const text = await file.text();
                workout = parseWorkoutFile(text, file.name);
            }
            if (workout) {
                newWorkouts.push(workout);
                console.log('Parsed workout:', file.name, workout);
            } else {
                console.warn('Failed to parse:', file.name);
            }
        } catch (error) {
            console.error('Error reading file:', file.name, error);
        }
    }

    // Add new workouts to existing data
    const beforeCount = workoutsData.length;
    workoutsData = [...workoutsData, ...newWorkouts];
    const afterAddCount = workoutsData.length;

    document.getElementById('loading').classList.remove('active');

    if (newWorkouts.length > 0 && workoutsData.length > 0) {
        // Remove duplicates using a Map approach
        // This works even if same workout is uploaded in TCX and FIT formats
        const uniqueWorkouts = [];
        const seen = new Set();

        for (const workout of workoutsData) {
            let isDuplicate = false;

            // Check if this workout is a duplicate of any we've already seen
            for (let i = 0; i < uniqueWorkouts.length; i++) {
                const existing = uniqueWorkouts[i];

                // Compare dates (within 1 minute tolerance)
                const dateDiff = Math.abs(existing.date.getTime() - workout.date.getTime());
                const sameDate = dateDiff < 60000; // 1 minute

                // Compare duration (within 5% tolerance or 30 seconds)
                const durationDiff = Math.abs(existing.duration - workout.duration);
                const sameDuration = durationDiff < 30 || (workout.duration > 0 && durationDiff / workout.duration < 0.05);

                // Compare calories (within 10% tolerance or 20 kcal)
                const caloriesDiff = Math.abs(existing.calories - workout.calories);
                const sameCalories = caloriesDiff < 20 || (workout.calories > 0 && caloriesDiff / workout.calories < 0.10);

                if (sameDate && sameDuration && sameCalories) {
                    isDuplicate = true;
                    // Keep the FIT copy of a workout: it carries more metrics than TCX/GPX
                    if (workout.source === 'fit' && existing.source !== 'fit') {
                        uniqueWorkouts[i] = workout;
                    }
                    console.log('Duplicate found:', workout.date, 'matches existing workout');
                    break;
                }
            }

            if (!isDuplicate) {
                uniqueWorkouts.push(workout);
            }
        }

        workoutsData = uniqueWorkouts;

        const finalCount = workoutsData.length;
        const duplicatesRemoved = afterAddCount - finalCount;

        console.log(`Loaded ${newWorkouts.length} files, ${duplicatesRemoved} duplicates removed. Total: ${finalCount} workouts`);

        if (duplicatesRemoved > 0) {
            showNotification(t('notify.duplicates', { n: duplicatesRemoved }), 'info');
        }

        if (newWorkouts.length > 0) {
            showNotification(t('notify.loaded', { n: newWorkouts.length }), 'info');
        }

        workoutsData.sort((a, b) => b.date - a.date);
        updateDashboard();
        console.log('Dashboard updated');
        generateInsights();
        console.log('Insights generated');
        analyzeHeartRateZones();
        console.log('Heart rate zones analyzed');
        displayWeeklyProgress();
        console.log('Weekly progress displayed');
        displayBenchmarks();
        console.log('Benchmarks displayed');
    } else {
        console.error('No workouts were successfully parsed from the uploaded files');
        console.log('Files processed:', files.length);
        console.log('New workouts parsed:', newWorkouts.length);
        console.log('Details of parsing attempts:');

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            console.log(`File ${i + 1}: ${file.name}, Type: ${file.type}, Size: ${file.size}`);
        }

        alert(t('alert.loadFailed'));
    }
}

// Load profile on startup
loadProfile();

if (window.Chart) {
    Chart.defaults.font.family = "'Manrope', sans-serif";
}
applyStaticTranslations();
document.getElementById('totalTime').textContent = `0${t('unit.h')}`;
document.getElementById('themeBtn').addEventListener('click', () => {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
});
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});
