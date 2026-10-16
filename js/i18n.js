// Interface texts in ru / en / et, sport names, number and date formatting

// ---------- Localization (ru / en / et) ----------
const LANGUAGES = ['ru', 'en', 'et'];
const LOCALES = { ru: 'ru-RU', en: 'en-GB', et: 'et-EE' };

// Plural keys are objects keyed by Intl.PluralRules categories (one / few / many / other)
const I18N = {
    ru: {
        'meta.title': 'Бадминтон: Трекер Здоровья',
        'lang.label': 'Язык',
        'profile.button': '👤 Профиль',
        'header.title': 'ТРЕКЕР ЗДОРОВЬЯ',
        'header.subtitle': 'Анализ тренировок на основе TCX, GPX и FIT данных',
        'upload.title': 'Загрузите файлы тренировок',
        'upload.hint': 'Поддерживаются форматы: TCX, GPX, FIT (универсальная совместимость)',
        'clear.button': '🗑️ Очистить все данные',
        'loading': 'Обработка данных...',
        'card.workouts.title': 'Всего тренировок',
        'card.workouts.sub': 'За всё время',
        'card.calories.title': 'Сожжено калорий',
        'card.calories.sub': 'Общий расход энергии',
        'card.hr.title': 'Средний пульс',
        'card.hr.sub': 'Ударов в минуту',
        'card.time.title': 'Общее время',
        'card.time.sub': 'Активных тренировок',
        'chart.dynamics.title': '📈 Динамика тренировок',
        'chart.hr.title': '💗 Анализ пульса',
        'insights.title': '💡 Рекомендации по здоровью',
        'zones.title': '❤️ Зоны пульса',
        'benchmarks.title': '📊 Сравнение с лучшими показателями',
        'history.title': '📋 История тренировок',
        'history.empty': 'Загрузите файлы тренировок для начала анализа',
        'confirm.title': '⚠️ Подтверждение',
        'confirm.text': 'Вы уверены, что хотите очистить все данные? Это действие нельзя отменить.',
        'confirm.clear': 'Очистить',
        'common.cancel': 'Отмена',
        'common.save': 'Сохранить',
        'profile.title': '👤 Мой профиль',
        'profile.age': 'Возраст (лет)',
        'profile.agePlaceholder': 'Например: 25',
        'profile.gender': 'Пол',
        'profile.genderNone': 'Не указан',
        'profile.genderMale': 'Мужской',
        'profile.genderFemale': 'Женский',
        'profile.weight': 'Вес (кг)',
        'profile.weightPlaceholder': 'Например: 70',
        'profile.height': 'Рост (см)',
        'profile.heightPlaceholder': 'Например: 175',
        'profile.bmi': 'ИМТ',
        'profile.maxHr': 'Макс. пульс',

        'unit.bpm': 'уд/мин',
        'unit.kcal': 'ккал',
        'unit.kcalPerKg': 'ккал/кг',
        'unit.min': 'мин',
        'unit.h': 'ч',
        'unit.km': 'км',
        'unit.times': { one: 'раз', few: 'раза', many: 'раз', other: 'раза' },

        'notify.dropNoFiles': 'Файлы не получены. Если перетаскиваете из Telegram, сначала сохраните их в папку',
        'notify.cleared': 'Все данные очищены',
        'notify.profileSaved': 'Профиль сохранён',
        'notify.duplicates': 'Обнаружено и удалено дубликатов: {n}',
        'notify.loaded': {
            one: 'Загружена {n} тренировка',
            few: 'Загружено {n} тренировки',
            many: 'Загружено {n} тренировок',
            other: 'Загружено {n} тренировки'
        },
        'notify.fitModuleFailed': 'Не удалось загрузить модуль для FIT-файлов. Проверьте подключение к интернету',
        'alert.clearError': 'Ошибка при очистке данных: {error}',
        'alert.loadFailed': 'Не удалось загрузить файлы. Проверьте консоль (F12) для деталей или попробуйте другие файлы.',

        'badge.min': 'мин.',
        'badge.minHrTitle': 'Минимальный пульс',
        'badge.effect': 'эффект',
        'badge.effectTitle': 'Тренировочный эффект по данным часов (0–5): аэробный / анаэробный',
        'badge.load': 'нагрузка',
        'badge.loadTitle': 'Тренировочная нагрузка по данным часов',
        'theme.toLight': 'Светлая тема',
        'theme.toDark': 'Тёмная тема',
        'last.title': 'Последняя тренировка',
        'last.avgMax': 'средн. / макс. {max}',
        'chart.average': 'среднее {v} мин',
        'group.racket': 'Ракеточные',
        'group.walk': 'Ходьба',
        'group.intervals': 'Интервальные и силовые',
        'group.endurance': 'Бег, вело, плавание',
        'group.other': 'Другое',
        'chart.duration': 'Длительность',
        'chart.avgHr': 'Средний пульс',
        'chart.hrRange': '(мин. {min}, макс. {max})',

        'bmi.under': 'Недостаточный',
        'bmi.normal': 'Нормальный',
        'bmi.over': 'Избыточный',
        'bmi.obese': 'Ожирение',

        'ins.regular.title': 'Отличная регулярность',
        'ins.regular.text': 'Вы тренируетесь {n} раз в неделю. Это оптимальный режим для поддержания формы и развития выносливости.',
        'ins.moreOften.title': 'Увеличьте частоту',
        'ins.moreOften.text': 'Вы тренируетесь {n} раз в неделю. Для лучших результатов рекомендуется 3-4 тренировки в неделю.',
        'ins.irregular.title': 'Нужна регулярность',
        'ins.irregular.text': 'Старайтесь тренироваться минимум 2-3 раза в неделю для поддержания физической формы.',
        'ins.hrPct': ' ({pct}% от максимума)',
        'ins.hrOptimal.title': 'Оптимальная интенсивность',
        'ins.hrOptimal.text': 'Средний пульс {hr} уд/мин{pct} находится в аэробной зоне, что отлично для выносливости и сжигания жира.',
        'ins.hrHigh.title': 'Высокая интенсивность',
        'ins.hrHigh.text': 'Средний пульс {hr} уд/мин{pct} довольно высок. Убедитесь, что включаете восстановительные периоды между интенсивными тренировками.',
        'ins.hrModerate.title': 'Умеренная нагрузка',
        'ins.hrModerate.text': 'Средний пульс {hr} уд/мин{pct}. Можно увеличить интенсивность для лучшего эффекта тренировок.',
        'ins.perKg': ' ({v} ккал/кг)',
        'ins.energyHigh.title': 'Высокий расход энергии',
        'ins.energyHigh.text': 'В среднем вы сжигаете {kcal} ккал за тренировку{perKg}. Отличный показатель! Не забывайте о правильном питании для восстановления.',
        'ins.energyGrow.title': 'Потенциал для роста',
        'ins.energyGrow.text': 'Средний расход {kcal} ккал за тренировку{perKg}. Можно увеличить продолжительность или интенсивность игры.',
        'ins.recovery.title': 'Важность восстановления',
        'ins.recovery.text': 'Средняя продолжительность тренировок {min} мин. При такой нагрузке необходим полноценный сон (7-9 часов) и день отдыха между тренировками.',
        'ins.bmiNormal.title': 'Идеальный вес',
        'ins.bmiNormal.text': 'Ваш ИМТ {bmi} в норме. Продолжайте поддерживать текущий режим тренировок и питания.',
        'ins.bmiLose.title': 'Фокус на снижение веса',
        'ins.bmiLose.text': 'Ваш ИМТ {bmi} ({category}). Бадминтон - отличный выбор для снижения веса! Рекомендуется сочетать с правильным питанием и увеличить частоту тренировок до 4-5 раз в неделю.',
        'ins.bmiGain.title': 'Набор массы',
        'ins.bmiGain.text': 'Ваш ИМТ {bmi} ({category}). Обратите внимание на калорийность питания и добавьте силовые тренировки для набора мышечной массы.',
        'ins.water.title': 'Не забывайте о воде',
        'ins.water.text': 'При средней интенсивности ваших тренировок рекомендуется выпивать около {ml} мл воды во время игры (каждые 15 минут по 200 мл).',
        'ins.postMeal.title': 'Питание для восстановления',
        'ins.postMeal.text': 'После интенсивной тренировки ({kcal} ккал) восполните энергию в течение 30-60 минут: углеводы + белок (например, банан + протеиновый коктейль). Это ускорит восстановление мышц.',
        'ins.preMeal.title': 'Питание перед тренировкой',
        'ins.preMeal.text': 'За 1-2 часа до тренировки съешьте легкоусвояемые углеводы (овсянка, банан, тост с мёдом) для поддержания энергии на протяжении всей игры ({min} мин).',

        'zone.rest': 'Отдых',
        'zone.warmup': 'Разминка',
        'zone.fat': 'Жиросжигание',
        'zone.aerobic': 'Аэробная',
        'zone.anaerobic': 'Анаэробная',
        'zone.max': 'Максимум',
        'zone.timeShare': '{pct}% времени',

        'progress.title': '📈 Прогресс по неделям',
        'progress.workouts': 'Тренировки',
        'progress.calories': 'Калории',
        'progress.avgHr': 'Средний пульс',
        'progress.time': 'Время',
        'progress.thisWeek': '{title} (эта неделя)',
        'progress.vsLast': '{change}% от прошлой',

        'bench.calories': 'Калории за тренировку',
        'bench.duration': 'Продолжительность',
        'bench.ageCalories': 'Калории vs средние для возраста',
        'bench.ageAvg': 'Средний показатель для вашего возраста: {value}',
        'bench.best': 'Ваш лучший результат: {value}',
        'bench.forecast': '🔮 Прогноз через месяц',
        'forecast.growth': 'При текущем темпе роста интенсивности, через месяц вы будете сжигать около {value} за тренировку. ',
        'forecast.decline': 'Интенсивность тренировок снижается. Рекомендуется увеличить продолжительность или темп игры. ',
        'forecast.stable': 'Вы поддерживаете стабильную интенсивность тренировок. ',
        'forecast.moreOften': 'Частота тренировок растёт — отличная тенденция! ',
        'forecast.monthly': 'Ожидаемый расход за месяц: {value}.'
    },
    en: {
        'meta.title': 'Badminton: Health Tracker',
        'lang.label': 'Language',
        'profile.button': '👤 Profile',
        'header.title': 'HEALTH TRACKER',
        'header.subtitle': 'Workout analysis from TCX, GPX and FIT data',
        'upload.title': 'Upload your workout files',
        'upload.hint': 'Supported formats: TCX, GPX, FIT (universal compatibility)',
        'clear.button': '🗑️ Clear all data',
        'loading': 'Processing data...',
        'card.workouts.title': 'Total workouts',
        'card.workouts.sub': 'All time',
        'card.calories.title': 'Calories burned',
        'card.calories.sub': 'Total energy expenditure',
        'card.hr.title': 'Average heart rate',
        'card.hr.sub': 'Beats per minute',
        'card.time.title': 'Total time',
        'card.time.sub': 'Of active training',
        'chart.dynamics.title': '📈 Workout trends',
        'chart.hr.title': '💗 Heart rate analysis',
        'insights.title': '💡 Health recommendations',
        'zones.title': '❤️ Heart rate zones',
        'benchmarks.title': '📊 Compared with your best',
        'history.title': '📋 Workout history',
        'history.empty': 'Upload workout files to start the analysis',
        'confirm.title': '⚠️ Confirmation',
        'confirm.text': 'Are you sure you want to clear all data? This cannot be undone.',
        'confirm.clear': 'Clear',
        'common.cancel': 'Cancel',
        'common.save': 'Save',
        'profile.title': '👤 My profile',
        'profile.age': 'Age (years)',
        'profile.agePlaceholder': 'e.g. 25',
        'profile.gender': 'Gender',
        'profile.genderNone': 'Not specified',
        'profile.genderMale': 'Male',
        'profile.genderFemale': 'Female',
        'profile.weight': 'Weight (kg)',
        'profile.weightPlaceholder': 'e.g. 70',
        'profile.height': 'Height (cm)',
        'profile.heightPlaceholder': 'e.g. 175',
        'profile.bmi': 'BMI',
        'profile.maxHr': 'Max heart rate',

        'unit.bpm': 'bpm',
        'unit.kcal': 'kcal',
        'unit.kcalPerKg': 'kcal/kg',
        'unit.min': 'min',
        'unit.h': 'h',
        'unit.km': 'km',
        'unit.times': { one: 'time', other: 'times' },

        'notify.dropNoFiles': 'No files received. If you are dragging from Telegram, save them to a folder first',
        'notify.cleared': 'All data cleared',
        'notify.profileSaved': 'Profile saved',
        'notify.duplicates': 'Duplicates found and removed: {n}',
        'notify.loaded': { one: 'Loaded {n} workout', other: 'Loaded {n} workouts' },
        'notify.fitModuleFailed': 'Could not load the FIT file module. Check your internet connection',
        'alert.clearError': 'Error while clearing data: {error}',
        'alert.loadFailed': 'Could not load the files. Check the console (F12) for details or try other files.',

        'badge.min': 'min',
        'badge.minHrTitle': 'Minimum heart rate',
        'badge.effect': 'effect',
        'badge.effectTitle': 'Training effect from the watch (0–5): aerobic / anaerobic',
        'badge.load': 'load',
        'badge.loadTitle': 'Training load from the watch',
        'theme.toLight': 'Light theme',
        'theme.toDark': 'Dark theme',
        'last.title': 'Latest workout',
        'last.avgMax': 'avg / max {max}',
        'chart.average': 'average {v} min',
        'group.racket': 'Racket sports',
        'group.walk': 'Walking',
        'group.intervals': 'Intervals & strength',
        'group.endurance': 'Running, cycling, swimming',
        'group.other': 'Other',
        'chart.duration': 'Duration',
        'chart.avgHr': 'Average heart rate',
        'chart.hrRange': '(min {min}, max {max})',

        'bmi.under': 'Underweight',
        'bmi.normal': 'Normal',
        'bmi.over': 'Overweight',
        'bmi.obese': 'Obese',

        'ins.regular.title': 'Great consistency',
        'ins.regular.text': 'You train {n} times a week. That is an optimal routine for staying fit and building endurance.',
        'ins.moreOften.title': 'Train more often',
        'ins.moreOften.text': 'You train {n} times a week. For better results, 3–4 workouts a week are recommended.',
        'ins.irregular.title': 'Consistency needed',
        'ins.irregular.text': 'Try to train at least 2–3 times a week to stay in shape.',
        'ins.hrPct': ' ({pct}% of max)',
        'ins.hrOptimal.title': 'Optimal intensity',
        'ins.hrOptimal.text': 'Your average heart rate of {hr} bpm{pct} is in the aerobic zone, which is great for endurance and fat burning.',
        'ins.hrHigh.title': 'High intensity',
        'ins.hrHigh.text': 'Your average heart rate of {hr} bpm{pct} is quite high. Make sure you include recovery periods between hard sessions.',
        'ins.hrModerate.title': 'Moderate load',
        'ins.hrModerate.text': 'Average heart rate: {hr} bpm{pct}. You can raise the intensity to get more out of your workouts.',
        'ins.perKg': ' ({v} kcal/kg)',
        'ins.energyHigh.title': 'High energy expenditure',
        'ins.energyHigh.text': 'On average you burn {kcal} kcal per workout{perKg}. Excellent! Don\'t forget proper nutrition for recovery.',
        'ins.energyGrow.title': 'Room to grow',
        'ins.energyGrow.text': 'Average burn: {kcal} kcal per workout{perKg}. You can increase the duration or intensity of play.',
        'ins.recovery.title': 'Recovery matters',
        'ins.recovery.text': 'Your workouts last {min} min on average. With this load you need full sleep (7–9 hours) and a rest day between workouts.',
        'ins.bmiNormal.title': 'Healthy weight',
        'ins.bmiNormal.text': 'Your BMI of {bmi} is in the normal range. Keep up your current training and nutrition routine.',
        'ins.bmiLose.title': 'Focus on weight loss',
        'ins.bmiLose.text': 'Your BMI is {bmi} ({category}). Badminton is a great choice for losing weight! Combine it with proper nutrition and train 4–5 times a week.',
        'ins.bmiGain.title': 'Building mass',
        'ins.bmiGain.text': 'Your BMI is {bmi} ({category}). Watch your calorie intake and add strength training to build muscle.',
        'ins.water.title': 'Stay hydrated',
        'ins.water.text': 'At your average workout intensity, aim to drink about {ml} ml of water during play (200 ml every 15 minutes).',
        'ins.postMeal.title': 'Recovery nutrition',
        'ins.postMeal.text': 'After an intense workout ({kcal} kcal), refuel within 30–60 minutes: carbs + protein (e.g. a banana + a protein shake). This speeds up muscle recovery.',
        'ins.preMeal.title': 'Pre-workout nutrition',
        'ins.preMeal.text': '1–2 hours before training, eat easily digestible carbs (oatmeal, a banana, toast with honey) to keep your energy up for the whole game ({min} min).',

        'zone.rest': 'Rest',
        'zone.warmup': 'Warm-up',
        'zone.fat': 'Fat burn',
        'zone.aerobic': 'Aerobic',
        'zone.anaerobic': 'Anaerobic',
        'zone.max': 'Maximum',
        'zone.timeShare': '{pct}% of time',

        'progress.title': '📈 Weekly progress',
        'progress.workouts': 'Workouts',
        'progress.calories': 'Calories',
        'progress.avgHr': 'Average heart rate',
        'progress.time': 'Time',
        'progress.thisWeek': '{title} (this week)',
        'progress.vsLast': '{change}% vs last week',

        'bench.calories': 'Calories per workout',
        'bench.duration': 'Duration',
        'bench.ageCalories': 'Calories vs. average for your age',
        'bench.ageAvg': 'Average for your age: {value}',
        'bench.best': 'Your best: {value}',
        'bench.forecast': '🔮 One-month forecast',
        'forecast.growth': 'If your intensity keeps growing at this pace, in a month you will burn about {value} per workout. ',
        'forecast.decline': 'Your training intensity is dropping. Try increasing the duration or pace of play. ',
        'forecast.stable': 'You are keeping your training intensity steady. ',
        'forecast.moreOften': 'You are training more often — a great trend! ',
        'forecast.monthly': 'Expected burn over the month: {value}.'
    },
    et: {
        'meta.title': 'Sulgpall: terviseträker',
        'lang.label': 'Keel',
        'profile.button': '👤 Profiil',
        'header.title': 'TERVISETRÄKER',
        'header.subtitle': 'Treeningute analüüs TCX-, GPX- ja FIT-andmete põhjal',
        'upload.title': 'Laadi üles treeningufailid',
        'upload.hint': 'Toetatud vormingud: TCX, GPX, FIT (universaalne ühilduvus)',
        'clear.button': '🗑️ Kustuta kõik andmed',
        'loading': 'Andmete töötlemine...',
        'card.workouts.title': 'Treeninguid kokku',
        'card.workouts.sub': 'Kogu aja jooksul',
        'card.calories.title': 'Põletatud kalorid',
        'card.calories.sub': 'Kogu energiakulu',
        'card.hr.title': 'Keskmine pulss',
        'card.hr.sub': 'Lööki minutis',
        'card.time.title': 'Koguaeg',
        'card.time.sub': 'Aktiivset treeningut',
        'chart.dynamics.title': '📈 Treeningute dünaamika',
        'chart.hr.title': '💗 Pulsi analüüs',
        'insights.title': '💡 Soovitused tervisele',
        'zones.title': '❤️ Pulsitsoonid',
        'benchmarks.title': '📊 Võrdlus parimate tulemustega',
        'history.title': '📋 Treeningute ajalugu',
        'history.empty': 'Analüüsi alustamiseks laadi üles treeningufailid',
        'confirm.title': '⚠️ Kinnitus',
        'confirm.text': 'Kas oled kindel, et soovid kõik andmed kustutada? Seda ei saa tagasi võtta.',
        'confirm.clear': 'Kustuta',
        'common.cancel': 'Tühista',
        'common.save': 'Salvesta',
        'profile.title': '👤 Minu profiil',
        'profile.age': 'Vanus (aastat)',
        'profile.agePlaceholder': 'Näiteks: 25',
        'profile.gender': 'Sugu',
        'profile.genderNone': 'Määramata',
        'profile.genderMale': 'Mees',
        'profile.genderFemale': 'Naine',
        'profile.weight': 'Kaal (kg)',
        'profile.weightPlaceholder': 'Näiteks: 70',
        'profile.height': 'Pikkus (cm)',
        'profile.heightPlaceholder': 'Näiteks: 175',
        'profile.bmi': 'KMI',
        'profile.maxHr': 'Maks. pulss',

        'unit.bpm': 'lööki/min',
        'unit.kcal': 'kcal',
        'unit.kcalPerKg': 'kcal/kg',
        'unit.min': 'min',
        'unit.h': 'h',
        'unit.km': 'km',
        'unit.times': { one: 'kord', other: 'korda' },

        'notify.dropNoFiles': 'Faile ei saadud. Kui lohistad Telegramist, salvesta need enne kausta',
        'notify.cleared': 'Kõik andmed kustutatud',
        'notify.profileSaved': 'Profiil salvestatud',
        'notify.duplicates': 'Leitud ja eemaldatud duplikaate: {n}',
        'notify.loaded': { one: 'Laaditud {n} treening', other: 'Laaditud {n} treeningut' },
        'notify.fitModuleFailed': 'FIT-failide moodulit ei õnnestunud laadida. Kontrolli internetiühendust',
        'alert.clearError': 'Viga andmete kustutamisel: {error}',
        'alert.loadFailed': 'Faile ei õnnestunud laadida. Üksikasjad leiad konsoolist (F12) või proovi teisi faile.',

        'badge.min': 'min',
        'badge.minHrTitle': 'Minimaalne pulss',
        'badge.effect': 'efekt',
        'badge.effectTitle': 'Kella mõõdetud treeningefekt (0–5): aeroobne / anaeroobne',
        'badge.load': 'koormus',
        'badge.loadTitle': 'Kella mõõdetud treeningkoormus',
        'theme.toLight': 'Hele teema',
        'theme.toDark': 'Tume teema',
        'last.title': 'Viimane treening',
        'last.avgMax': 'kesk. / maks. {max}',
        'chart.average': 'keskmine {v} min',
        'group.racket': 'Reketispordid',
        'group.walk': 'Kõndimine',
        'group.intervals': 'Intervall- ja jõutreening',
        'group.endurance': 'Jooks, ratas, ujumine',
        'group.other': 'Muu',
        'chart.duration': 'Kestus',
        'chart.avgHr': 'Keskmine pulss',
        'chart.hrRange': '(min {min}, maks {max})',

        'bmi.under': 'Alakaal',
        'bmi.normal': 'Normaalkaal',
        'bmi.over': 'Ülekaal',
        'bmi.obese': 'Rasvumine',

        'ins.regular.title': 'Suurepärane regulaarsus',
        'ins.regular.text': 'Treenid {n} korda nädalas. See on optimaalne režiim vormi hoidmiseks ja vastupidavuse arendamiseks.',
        'ins.moreOften.title': 'Treeni sagedamini',
        'ins.moreOften.text': 'Treenid {n} korda nädalas. Paremate tulemuste jaoks soovitatakse 3–4 treeningut nädalas.',
        'ins.irregular.title': 'Vaja on regulaarsust',
        'ins.irregular.text': 'Püüa treenida vähemalt 2–3 korda nädalas, et vormis püsida.',
        'ins.hrPct': ' ({pct}% maksimumist)',
        'ins.hrOptimal.title': 'Optimaalne intensiivsus',
        'ins.hrOptimal.text': 'Keskmine pulss {hr} lööki/min{pct} on aeroobses tsoonis, mis sobib suurepäraselt vastupidavuse ja rasvapõletuse jaoks.',
        'ins.hrHigh.title': 'Kõrge intensiivsus',
        'ins.hrHigh.text': 'Keskmine pulss {hr} lööki/min{pct} on üsna kõrge. Jäta intensiivsete treeningute vahele kindlasti taastumisaega.',
        'ins.hrModerate.title': 'Mõõdukas koormus',
        'ins.hrModerate.text': 'Keskmine pulss {hr} lööki/min{pct}. Treeningute parema mõju saavutamiseks võid intensiivsust tõsta.',
        'ins.perKg': ' ({v} kcal/kg)',
        'ins.energyHigh.title': 'Suur energiakulu',
        'ins.energyHigh.text': 'Keskmiselt põletad treeningu kohta {kcal} kcal{perKg}. Suurepärane tulemus! Ära unusta taastumiseks õiget toitumist.',
        'ins.energyGrow.title': 'Arenguruumi on',
        'ins.energyGrow.text': 'Keskmine kulu on {kcal} kcal treeningu kohta{perKg}. Võid pikendada mängu kestust või tõsta intensiivsust.',
        'ins.recovery.title': 'Taastumine on oluline',
        'ins.recovery.text': 'Treeningu keskmine kestus on {min} min. Sellise koormuse juures on vaja täisväärtuslikku und (7–9 tundi) ja puhkepäeva treeningute vahel.',
        'ins.bmiNormal.title': 'Tervislik kaal',
        'ins.bmiNormal.text': 'Sinu KMI {bmi} on normis. Jätka praeguse treening- ja toitumisrežiimiga.',
        'ins.bmiLose.title': 'Fookus kaalulangusel',
        'ins.bmiLose.text': 'Sinu KMI on {bmi} ({category}). Sulgpall on kaalu langetamiseks suurepärane valik! Kombineeri seda õige toitumisega ja treeni 4–5 korda nädalas.',
        'ins.bmiGain.title': 'Massi kasvatamine',
        'ins.bmiGain.text': 'Sinu KMI on {bmi} ({category}). Jälgi toidu kalorsust ja lisa lihasmassi kasvatamiseks jõutreeninguid.',
        'ins.water.title': 'Ära unusta vett',
        'ins.water.text': 'Sinu treeningute keskmise intensiivsuse juures soovitatakse mängu ajal juua umbes {ml} ml vett (200 ml iga 15 minuti järel).',
        'ins.postMeal.title': 'Taastav toitumine',
        'ins.postMeal.text': 'Pärast intensiivset treeningut ({kcal} kcal) taasta energia 30–60 minuti jooksul: süsivesikud + valk (nt banaan + proteiinijook). See kiirendab lihaste taastumist.',
        'ins.preMeal.title': 'Toitumine enne treeningut',
        'ins.preMeal.text': '1–2 tundi enne treeningut söö kergesti seeditavaid süsivesikuid (kaerahelbepuder, banaan, röstsai meega), et energiat jaguks kogu mänguks ({min} min).',

        'zone.rest': 'Puhkus',
        'zone.warmup': 'Soojendus',
        'zone.fat': 'Rasvapõletus',
        'zone.aerobic': 'Aeroobne',
        'zone.anaerobic': 'Anaeroobne',
        'zone.max': 'Maksimum',
        'zone.timeShare': '{pct}% ajast',

        'progress.title': '📈 Nädalane areng',
        'progress.workouts': 'Treeningud',
        'progress.calories': 'Kalorid',
        'progress.avgHr': 'Keskmine pulss',
        'progress.time': 'Aeg',
        'progress.thisWeek': '{title} (see nädal)',
        'progress.vsLast': '{change}% eelmise nädalaga võrreldes',

        'bench.calories': 'Kalorid treeningu kohta',
        'bench.duration': 'Kestus',
        'bench.ageCalories': 'Kalorid vs sinu vanuse keskmine',
        'bench.ageAvg': 'Sinu vanuse keskmine: {value}',
        'bench.best': 'Sinu parim tulemus: {value}',
        'bench.forecast': '🔮 Prognoos kuu pärast',
        'forecast.growth': 'Kui intensiivsus kasvab samas tempos, põletad kuu pärast treeningu kohta umbes {value}. ',
        'forecast.decline': 'Treeningute intensiivsus langeb. Proovi pikendada mängu kestust või tõsta tempot. ',
        'forecast.stable': 'Hoiad treeningute intensiivsust stabiilsena. ',
        'forecast.moreOften': 'Treenid üha sagedamini — suurepärane suundumus! ',
        'forecast.monthly': 'Oodatav kulu kuus: {value}.'
    }
};

// Sport types: key -> icon and names. Keys are FIT sport / sub-sport values,
// so a FIT workout keeps a translatable sport; TCX/GPX names are matched against these.
const SPORTS = {
    generic: { icon: '💪', ru: 'Тренировка', en: 'Workout', et: 'Treening' },
    running: { icon: '🏃', ru: 'Бег', en: 'Running', et: 'Jooksmine' },
    treadmill: { icon: '🏃', ru: 'Бег на дорожке', en: 'Treadmill', et: 'Jooksulint' },
    indoorRunning: { icon: '🏃', ru: 'Бег в помещении', en: 'Indoor running', et: 'Sisejooks' },
    trail: { icon: '🏃', ru: 'Трейлраннинг', en: 'Trail running', et: 'Rajajooks' },
    cycling: { icon: '🚴', ru: 'Велосипед', en: 'Cycling', et: 'Rattasõit' },
    indoorCycling: { icon: '🚴', ru: 'Велотренажёр', en: 'Indoor cycling', et: 'Siserattasõit' },
    spin: { icon: '🚴', ru: 'Сайкл', en: 'Spinning', et: 'Spinning' },
    mountain: { icon: '🚵', ru: 'Маунтинбайк', en: 'Mountain biking', et: 'Maastikurattasõit' },
    walking: { icon: '🚶', ru: 'Ходьба', en: 'Walking', et: 'Kõndimine' },
    indoorWalking: { icon: '🚶', ru: 'Ходьба в помещении', en: 'Indoor walking', et: 'Sisekõnd' },
    casualWalking: { icon: '🚶', ru: 'Прогулка', en: 'Casual walk', et: 'Jalutuskäik' },
    speedWalking: { icon: '🚶', ru: 'Спортивная ходьба', en: 'Speed walking', et: 'Kiirkõnd' },
    hiking: { icon: '🥾', ru: 'Хайкинг', en: 'Hiking', et: 'Matkamine' },
    swimming: { icon: '🏊', ru: 'Плавание', en: 'Swimming', et: 'Ujumine' },
    lapSwimming: { icon: '🏊', ru: 'Плавание в бассейне', en: 'Pool swimming', et: 'Basseiniujumine' },
    openWater: { icon: '🏊', ru: 'Плавание на открытой воде', en: 'Open water swimming', et: 'Avaveeujumine' },
    training: { icon: '💪', ru: 'Тренировка', en: 'Training', et: 'Treening' },
    fitnessEquipment: { icon: '🏋️', ru: 'Тренажёр', en: 'Fitness equipment', et: 'Trenažöör' },
    strengthTraining: { icon: '💪', ru: 'Силовая тренировка', en: 'Strength training', et: 'Jõutreening' },
    cardioTraining: { icon: '❤️', ru: 'Кардиотренировка', en: 'Cardio training', et: 'Kardiotreening' },
    flexibilityTraining: { icon: '🧘', ru: 'Растяжка', en: 'Flexibility training', et: 'Venitus' },
    yoga: { icon: '🧘', ru: 'Йога', en: 'Yoga', et: 'Jooga' },
    pilates: { icon: '🧘', ru: 'Пилатес', en: 'Pilates', et: 'Pilates' },
    hiit: { icon: '⚡', ru: 'Интервальная тренировка (HIIT)', en: 'Interval training (HIIT)', et: 'Intervalltreening (HIIT)' },
    tabata: { icon: '⚡', ru: 'Интервальная тренировка (табата)', en: 'Interval training (Tabata)', et: 'Intervalltreening (tabata)' },
    amrap: { icon: '⚡', ru: 'Интервальная тренировка (AMRAP)', en: 'Interval training (AMRAP)', et: 'Intervalltreening (AMRAP)' },
    emom: { icon: '⚡', ru: 'Интервальная тренировка (EMOM)', en: 'Interval training (EMOM)', et: 'Intervalltreening (EMOM)' },
    elliptical: { icon: '🏋️', ru: 'Эллипс', en: 'Elliptical', et: 'Elliptiline trenažöör' },
    indoorRowing: { icon: '🚣', ru: 'Гребной тренажёр', en: 'Indoor rowing', et: 'Sõudeergomeeter' },
    stairClimbing: { icon: '🏋️', ru: 'Степпер', en: 'Stair climbing', et: 'Trepironimine' },
    racket: { icon: '🏸', ru: 'Ракеточный спорт', en: 'Racket sport', et: 'Reketisport' },
    badminton: { icon: '🏸', ru: 'Бадминтон', en: 'Badminton', et: 'Sulgpall' },
    tableTennis: { icon: '🏓', ru: 'Настольный теннис', en: 'Table tennis', et: 'Lauatennis' },
    squash: { icon: '🎾', ru: 'Сквош', en: 'Squash', et: 'Squash' },
    padel: { icon: '🎾', ru: 'Падел', en: 'Padel', et: 'Padel' },
    pickleball: { icon: '🏓', ru: 'Пиклбол', en: 'Pickleball', et: 'Pickleball' },
    racquetball: { icon: '🎾', ru: 'Ракетбол', en: 'Racquetball', et: 'Racquetball' },
    tennis: { icon: '🎾', ru: 'Теннис', en: 'Tennis', et: 'Tennis' },
    basketball: { icon: '🏀', ru: 'Баскетбол', en: 'Basketball', et: 'Korvpall' },
    soccer: { icon: '⚽', ru: 'Футбол', en: 'Football', et: 'Jalgpall' },
    volleyball: { icon: '🏐', ru: 'Волейбол', en: 'Volleyball', et: 'Võrkpall' },
    cricket: { icon: '🏏', ru: 'Крикет', en: 'Cricket', et: 'Kriket' },
    rowing: { icon: '🚣', ru: 'Гребля', en: 'Rowing', et: 'Sõudmine' },
    crossCountrySkiing: { icon: '⛷️', ru: 'Беговые лыжи', en: 'Cross-country skiing', et: 'Murdmaasuusatamine' },
    alpineSkiing: { icon: '⛷️', ru: 'Горные лыжи', en: 'Alpine skiing', et: 'Mäesuusatamine' },
    snowboarding: { icon: '🏂', ru: 'Сноуборд', en: 'Snowboarding', et: 'Lumelauasõit' },
    inlineSkating: { icon: '⛸️', ru: 'Ролики', en: 'Inline skating', et: 'Rulluisutamine' },
    iceSkating: { icon: '⛸️', ru: 'Коньки', en: 'Ice skating', et: 'Uisutamine' },
    rockClimbing: { icon: '🧗', ru: 'Скалолазание', en: 'Rock climbing', et: 'Kaljuronimine' },
    boxing: { icon: '🥊', ru: 'Бокс', en: 'Boxing', et: 'Poks' },
    dance: { icon: '💃', ru: 'Танцы', en: 'Dance', et: 'Tantsimine' },
    jumpRope: { icon: '🪢', ru: 'Скакалка', en: 'Jump rope', et: 'Hüppenöör' },
    meditation: { icon: '🧘', ru: 'Медитация', en: 'Meditation', et: 'Meditatsioon' },
    mobility: { icon: '🧘', ru: 'Мобильность', en: 'Mobility', et: 'Liikuvus' }
};

// Names that TCX/GPX files (Garmin, Zepp, Strava...) use for these sports
const SPORT_ALIASES = {
    'other': 'generic', 'biking': 'cycling', 'outdoor running': 'running',
    'outdoor cycling': 'cycling', 'pool swimming': 'lapSwimming',
    'open water swimming': 'openWater', 'roller skating': 'inlineSkating',
    'skiing': 'alpineSkiing', 'football': 'soccer',
    // Zepp activity names (TCX <Notes>, GPX track name)
    'интервальная тренировка': 'hiit', 'interval training': 'hiit', 'hiit': 'hiit',
    'силовой тренинг': 'strengthTraining', 'strength training': 'strengthTraining'
};

// Too general to identify a sport when found inside a longer name
const GENERIC_SPORT_KEYS = ['generic', 'training', 'racket', 'fitnessEquipment'];

// Match a sport name from a file to a SPORTS key (any language, case-insensitive)
function sportKeyFromName(name) {
    const needle = (name || '').trim().toLowerCase();
    if (!needle) return null;

    const known = Object.entries(SPORT_ALIASES).map(([alias, key]) => [alias, key]);
    for (const [key, sport] of Object.entries(SPORTS)) {
        LANGUAGES.forEach(lang => known.push([sport[lang].toLowerCase(), key]));
    }

    const exact = known.find(([candidate]) => candidate === needle);
    if (exact) return exact[1];

    // Zepp writes "<category> <type>", e.g. "Силовой тренинг Интервальная тренировка":
    // take the known name that ends last (the type), the longest one on a tie
    let best = null;
    for (const [candidate, key] of known) {
        if (GENERIC_SPORT_KEYS.includes(key) || candidate.length < 4) continue;
        const escaped = candidate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const match = new RegExp(`(^|[^\\p{L}])${escaped}(?=$|[^\\p{L}])`, 'u').exec(needle);
        if (!match) continue;
        const end = match.index + match[0].length;
        if (!best || end > best.end || (end === best.end && candidate.length > best.length)) {
            best = { key, end, length: candidate.length };
        }
    }
    return best ? best.key : null;
}

// Fallback icons for names we cannot map (e.g. "Силовой тренинг Интервальная тренировка"), first match wins
const SPORT_KEYWORD_ICONS = [
    ['бадминтон', '🏸'], ['badminton', '🏸'], ['теннис', '🎾'], ['tennis', '🎾'],
    ['интервал', '⚡'], ['interval', '⚡'], ['силов', '💪'], ['strength', '💪'],
    ['бег', '🏃'], ['run', '🏃'], ['ходьб', '🚶'], ['прогулк', '🚶'], ['walk', '🚶'],
    ['вело', '🚴'], ['cycl', '🚴'], ['bik', '🚴'], ['плаван', '🏊'], ['swim', '🏊'],
    ['йога', '🧘'], ['yoga', '🧘'], ['лыж', '⛷️'], ['ski', '⛷️'],
    ['футбол', '⚽'], ['баскетбол', '🏀'], ['ракеточ', '🏸']
];

function sportIcon(workout) {
    if (workout.sportKey && SPORTS[workout.sportKey]) return SPORTS[workout.sportKey].icon;
    const lower = (workout.sport || '').toLowerCase();
    return SPORT_KEYWORD_ICONS.find(([keyword]) => lower.includes(keyword))?.[1] || '💪';
}

function sportName(workout) {
    if (workout.sportKey && SPORTS[workout.sportKey]) return SPORTS[workout.sportKey][currentLang];
    return workout.sport || SPORTS.generic[currentLang];
}

function detectLanguage() {
    try {
        const saved = localStorage.getItem('appLanguage');
        if (LANGUAGES.includes(saved)) return saved;
    } catch (e) {
        // storage unavailable (private mode) - fall back to the browser language
    }
    const preferred = navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language || ''];
    for (const tag of preferred) {
        const code = (tag || '').slice(0, 2).toLowerCase();
        if (LANGUAGES.includes(code)) return code;
    }
    return 'en';
}

let currentLang = detectLanguage();

function locale() {
    return LOCALES[currentLang];
}

// t('key', { name: value }) -> translated string with {name} placeholders filled in
function t(key, params = {}) {
    let text = I18N[currentLang][key] ?? I18N.en[key] ?? key;
    if (typeof text === 'object') {
        const form = new Intl.PluralRules(locale()).select(params.n ?? 0);
        text = text[form] ?? text.other;
    }
    return text.replace(/\{(\w+)\}/g, (match, name) => (name in params ? params[name] : match));
}

function formatNumber(value, fractionDigits = 0) {
    return Number(value).toLocaleString(locale(), {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
    });
}

function formatDate(date, options) {
    return date.toLocaleDateString(locale(), options);
}

function applyStaticTranslations() {
    document.documentElement.lang = currentLang;
    document.title = t('meta.title');
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const active = btn.dataset.lang === currentLang;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    document.getElementById('langSwitch').setAttribute('aria-label', t('lang.label'));
    syncThemeButton();
}

function setLanguage(lang) {
    if (!LANGUAGES.includes(lang) || lang === currentLang) return;
    currentLang = lang;
    try {
        localStorage.setItem('appLanguage', lang);
    } catch (e) {
        // not critical: the choice just will not be remembered
    }
    applyStaticTranslations();
    // Re-render everything that was built from the loaded workouts
    if (workoutsData.length > 0) {
        updateDashboard();
        generateInsights();
        analyzeHeartRateZones();
        displayWeeklyProgress();
        displayBenchmarks();
    } else {
        renderEmptyWorkoutsList();
        document.getElementById('totalTime').textContent = `0${t('unit.h')}`;
    }
}

function renderEmptyWorkoutsList() {
    document.getElementById('workoutsList').innerHTML = `
        <div class="chart-title">${t('history.title')}</div>
        <div class="empty-state">
            <div class="empty-icon">📁</div>
            <div>${t('history.empty')}</div>
        </div>
    `;
}
