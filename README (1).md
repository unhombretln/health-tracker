# 💪 Health Tracker

**Workout Analysis Based on TCX and GPX Data**

A web application for detailed sports workout analysis with personalized health recommendations.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Privacy](https://img.shields.io/badge/privacy-100%25%20local-success)

[🇷🇺 Русская версия](#-трекер-здоровья-russian-version) | [📖 Documentation](#-features) | [🚀 Quick Start](#-how-to-use)

---

## 🎯 Features

### 📊 Data Analysis
- **Core Statistics**: workouts, calories, average heart rate, total time
- **Dynamic Charts**: progress visualization and heart rate analysis
- **Heart Rate Zones**: detailed time distribution across intensity zones
- **Weekly Progress**: current week vs previous week comparison
- **Benchmarks**: comparison with personal records and average metrics
- **Forecasting**: performance predictions at current pace

### 💡 Personalized Recommendations
- Training frequency and regularity analysis
- Heart rate-based intensity recommendations
- Nutrition and hydration advice
- BMI assessment and weight recommendations
- Recovery suggestions

### 👤 User Profile
- Age, weight, height, gender
- Automatic BMI calculation
- Maximum heart rate calculation
- Local data storage

## 🏃 Supported Sports

- 🏃 Running (Outdoor, Indoor, Treadmill)
- 🚴 Cycling (Outdoor, Indoor)
- 🚶 Walking
- 🥾 Hiking
- 🏊 Swimming (Pool, Open water)
- 🏸 Badminton
- 🎾 Tennis
- ⛸️ Roller skating
- ⛷️ Skiing
- 🧘 Yoga
- 💪 Strength training
- And many more!

## 📱 Compatible Devices

### TCX Format
- ✅ Amazfit + Zepp
- ✅ Garmin
- ✅ Polar
- ✅ Suunto
- ✅ Strava (export)

### GPX Format
- ✅ Apple Watch (via HealthFit/RunGap)
- ✅ Amazfit + Zepp
- ✅ Garmin
- ✅ All GPS-enabled devices

## 🚀 How to Use

### Online Version
Simply open the app in your browser - no installation required!

**Live Demo**: [health-tracker](https://yourusername.github.io/health-tracker) *(replace with your actual URL)*

### Local Usage
1. Download `index.html`
2. Open the file in your browser
3. Done! Works offline

### Loading Data
1. Export workouts from your app (Zepp, Garmin Connect, Strava, etc.)
2. Drag and drop TCX or GPX files into the upload zone
3. The app automatically processes data and shows detailed analytics

## 🔒 Privacy

**100% Local Data Processing**

- ✅ All files processed locally in your browser
- ✅ No data uploaded to any server
- ✅ Profile saved only in browser's localStorage
- ✅ Complete confidentiality of your health data
- ✅ Works offline after first load

## 🛠️ Technical Details

### Technologies
- Vanilla JavaScript (no frameworks)
- Chart.js for visualization
- DOMParser for XML parsing
- LocalStorage for profile storage
- Responsive CSS (Tailwind-inspired)

### Browser Support
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

### Format Parsing
- **TCX**: Full support for all metrics (heart rate, calories, duration, laps)
- **GPX**: Heart rate extraction from extensions, GPS-based distance calculation
- **Auto-deduplication**: removes duplicate workouts

## 📈 Usage Examples

### Export from Zepp (Amazfit)
1. Open workout in Zepp app
2. Tap ⋮ (three dots)
3. Select "Export" → TCX or GPX
4. Upload file to tracker

### Export from Apple Watch
1. Install HealthFit or RunGap
2. Select workout
3. Export as GPX or TCX
4. Upload to tracker

### Export from Strava
1. Open workout on Strava
2. Click ⚙️ → Export TCX
3. Upload file to tracker

## 🤝 Contributing

Contributions are welcome! You can:
- Report bugs via Issues
- Suggest new features
- Submit Pull Requests

## 📄 License

MIT License - free to use for personal and commercial purposes.

## 🙏 Acknowledgments

- Chart.js for excellent visualization library
- Fitness app developer community
- All users for feedback

## 📞 Support

If you have questions or issues:
1. Check Issues - the problem might already be solved
2. Create a new Issue with problem description
3. Attach example file (without personal data)

---

**Made with ❤️ for sports enthusiasts and healthy lifestyle advocates**

[⭐ Star on GitHub](https://github.com/yourusername/health-tracker) | [🐛 Report Bug](https://github.com/yourusername/health-tracker/issues) | [💡 Request Feature](https://github.com/yourusername/health-tracker/issues)

---

# 💪 Трекер Здоровья (Russian Version)

**Анализ тренировок на основе TCX и GPX данных**

Веб-приложение для детального анализа спортивных тренировок с персонализированными рекомендациями по здоровью.

## 🎯 Возможности

### 📊 Анализ данных
- **Основная статистика**: тренировки, калории, средний пульс, общее время
- **Графики динамики**: визуализация прогресса и анализ пульса
- **Зоны пульса**: детальное распределение времени по зонам интенсивности
- **Прогресс по неделям**: сравнение текущей недели с прошлой
- **Бенчмарки**: сравнение с личными рекордами и средними показателями
- **Прогноз**: оценка результатов при текущем темпе

### 💡 Персонализированные рекомендации
- Анализ частоты и регулярности тренировок
- Рекомендации по интенсивности на основе пульса
- Советы по питанию и гидратации
- Оценка ИМТ и рекомендации по весу
- Советы по восстановлению

### 👤 Профиль пользователя
- Возраст, вес, рост, пол
- Автоматический расчёт ИМТ
- Расчёт максимального пульса
- Сохранение данных локально

## 🏃 Поддерживаемые виды спорта

- 🏃 Бег (Running, Outdoor running, Treadmill)
- 🚴 Велоспорт (Cycling, Biking)
- 🚶 Ходьба (Walking)
- 🥾 Пеший туризм (Hiking)
- 🏊 Плавание (Swimming, Pool swimming)
- 🏸 Бадминтон
- 🎾 Теннис
- ⛸️ Ролики (Roller skating)
- ⛷️ Лыжи (Skiing)
- 🧘 Йога
- 💪 Силовые тренировки
- И многие другие!

## 📱 Совместимые устройства

### TCX формат
- ✅ Amazfit + Zepp
- ✅ Garmin
- ✅ Polar
- ✅ Suunto
- ✅ Strava (экспорт)

### GPX формат
- ✅ Apple Watch (через HealthFit/RunGap)
- ✅ Amazfit + Zepp
- ✅ Garmin
- ✅ Все устройства с GPS

## 🚀 Как использовать

### Онлайн версия
Просто откройте приложение в браузере - никакой установки не требуется!

**Демо**: [health-tracker](https://yourusername.github.io/health-tracker) *(замените на ваш URL)*

### Локальное использование
1. Скачайте `index.html`
2. Откройте файл в браузере
3. Готово! Работает офлайн

### Загрузка данных
1. Экспортируйте тренировки из вашего приложения (Zepp, Garmin Connect, Strava и т.д.)
2. Перетащите файлы TCX или GPX в зону загрузки
3. Приложение автоматически обработает данные и покажет детальную аналитику

## 🔒 Приватность

**100% локальная обработка данных**

- ✅ Все файлы обрабатываются локально в браузере
- ✅ Никакие данные не загружаются на сервер
- ✅ Профиль сохраняется только в localStorage браузера
- ✅ Полная конфиденциальность ваших данных о здоровье
- ✅ Работает офлайн после первой загрузки

## 🛠️ Технические детали

### Технологии
- Vanilla JavaScript (без фреймворков)
- Chart.js для визуализации
- DOMParser для XML
- LocalStorage для хранения профиля
- Responsive CSS (Tailwind-style)

### Браузеры
- ✅ Chrome/Edge (рекомендуется)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

### Парсинг форматов
- **TCX**: Полная поддержка всех метрик (пульс, калории, длительность, laps)
- **GPX**: Извлечение пульса из extensions, расчёт дистанции по GPS
- **Автоматическая дедупликация**: удаление повторяющихся тренировок

## 📈 Примеры использования

### Экспорт из Zepp (Amazfit)
1. Откройте тренировку в приложении Zepp
2. Нажмите ⋮ (три точки)
3. Выберите "Экспорт" → TCX или GPX
4. Загрузите файл в трекер

### Экспорт из Apple Watch
1. Установите HealthFit или RunGap
2. Выберите тренировку
3. Экспортируйте в GPX или TCX
4. Загрузите в трекер

### Экспорт из Strava
1. Откройте тренировку на Strava
2. Нажмите ⚙️ → Export TCX
3. Загрузите файл в трекер

## 🎨 Дизайн

Современный киберспортивный дизайн с тёмной темой:
- Неоновые акценты (зелёный #00ff88, голубой #00ccff)
- Плавные анимации
- Адаптивная вёрстка для мобильных устройств
- Интуитивный интерфейс

## 📊 Метрики и расчёты

### Зоны пульса
- Отдых: 50-60% от максимума
- Разминка: 60-70%
- Жиросжигание: 70-80%
- Аэробная: 80-85%
- Анаэробная: 85-90%
- Максимум: 90-100%

### Формулы
- Максимальный пульс: `220 - возраст`
- ИМТ: `вес / (рост в метрах)²`
- Калории (оценка): `((пульс × 0.6) - 20) × минуты`

## 🤝 Вклад в проект

Проект открыт для улучшений! Вы можете:
- Сообщить о багах через Issues
- Предложить новые функции
- Отправить Pull Request

## 📄 Лицензия

MIT License - используйте свободно для личных и коммерческих целей.

## 🙏 Благодарности

- Chart.js за отличную библиотеку визуализации
- Сообществу разработчиков фитнес-приложений
- Всем пользователям за обратную связь

## 📞 Поддержка

Если у вас возникли вопросы или проблемы:
1. Проверьте Issues - возможно, проблема уже решена
2. Создайте новый Issue с описанием проблемы
3. Приложите пример файла (без личных данных)

---

**Сделано с ❤️ для любителей спорта и здорового образа жизни**

[⭐ Star на GitHub](https://github.com/yourusername/health-tracker) | [🐛 Сообщить о баге](https://github.com/yourusername/health-tracker/issues) | [💡 Предложить улучшение](https://github.com/yourusername/health-tracker/issues)

