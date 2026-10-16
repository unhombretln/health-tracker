// Reading workout files: TCX and GPX (XML), FIT (binary, via the Garmin FIT SDK)

function parseWorkoutFile(text, filename) {
    try {
        if (filename.toLowerCase().endsWith('.tcx')) {
            const result = parseTCX(text);
            if (!result) {
                console.error('TCX parsing returned null for:', filename);
            }
            return result;
        } else if (filename.toLowerCase().endsWith('.gpx')) {
            const result = parseGPX(text);
            if (!result) {
                console.error('GPX parsing returned null for:', filename);
            }
            return result;
        }
        console.warn('Unknown file format:', filename);
        return null;
    } catch (error) {
        console.error('Error parsing file:', filename, error);
        return null;
    }
}

function parseTCX(text) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');

    // Check for parsing errors
    const parserError = xml.querySelector('parsererror');
    if (parserError) {
        console.error('XML parsing error:', parserError.textContent);
        return null;
    }

    const activity = xml.querySelector('Activity');
    if (!activity) {
        console.warn('No Activity element found in TCX');
        return null;
    }

    // TCX allows only Running/Biking/Other, so Zepp writes Sport="Other"
    // and puts the real activity name ("Бадминтон", ...) into <Notes>
    const sportAttr = activity.getAttribute('Sport');
    const notes = activity.querySelector('Notes')?.textContent.trim();
    const sport = (!sportAttr || sportAttr === 'Other') && notes ? notes : (sportAttr || null);
    const sportKey = sportKeyFromName(sport);
    console.log('TCX Sport attribute:', activity.getAttribute('Sport'), '-> sport:', sport, sportKey);
    // Workout date: Activity Id -> first Lap StartTime -> first Trackpoint Time.
    // Falling back to "now" makes several files uploaded together look like duplicates.
    const toDate = (value) => {
        const d = value ? new Date(value.trim()) : null;
        return d && !isNaN(d.getTime()) ? d : null;
    };
    let date = toDate(activity.querySelector('Id')?.textContent)
        || toDate(activity.querySelector('Lap')?.getAttribute('StartTime'))
        || toDate(activity.querySelector('Trackpoint Time')?.textContent);
    if (!date) {
        date = new Date();
        console.warn('No date in TCX file, using current date');
    }

    let totalTime = 0;
    let totalDistance = 0;
    let totalCalories = 0;
    let heartRates = [];
    let maxHeartRate = 0;
    let trackPoints = [];

    const laps = xml.querySelectorAll('Lap');

    if (laps.length === 0) {
        console.warn('No Lap elements found in TCX');
    }

    laps.forEach((lap, lapIndex) => {
        const lapTime = parseFloat(lap.querySelector('TotalTimeSeconds')?.textContent || 0);
        const lapDistance = parseFloat(lap.querySelector('DistanceMeters')?.textContent || 0);
        const lapCalories = parseFloat(lap.querySelector('Calories')?.textContent || 0);

        totalTime += lapTime;
        totalDistance += lapDistance;
        totalCalories += lapCalories;

        const points = lap.querySelectorAll('Trackpoint');
        points.forEach(point => {
            const hr = parseInt(point.querySelector('HeartRateBpm Value')?.textContent || 0);
            if (hr > 0) {
                heartRates.push(hr);
                maxHeartRate = Math.max(maxHeartRate, hr);
            }

            const time = point.querySelector('Time')?.textContent;
            const speed = parseFloat(point.querySelector('Speed')?.textContent || 0);

            trackPoints.push({
                time: time ? new Date(time) : null,
                heartRate: hr,
                speed: speed * 3.6 // m/s to km/h
            });
        });
    });

    const avgHeartRate = heartRates.length > 0 
        ? Math.round(heartRates.reduce((a, b) => a + b, 0) / heartRates.length)
        : 0;

    // Validate that we have at least some data
    if (totalTime === 0 && totalCalories === 0) {
        console.warn('TCX file has no usable data');
        return null;
    }

    console.log('Successfully parsed TCX:', {
        date: date.toISOString(),
        duration: totalTime,
        calories: totalCalories,
        laps: laps.length
    });

    return {
        date,
        sport,
        sportKey,
        duration: totalTime,
        distance: totalDistance,
        calories: totalCalories,
        avgHeartRate,
        maxHeartRate,
        heartRates,
        trackPoints
    };
}

// FIT is a binary format: decoded with Garmin's official FIT SDK,
// which is loaded only when a .fit file is uploaded
const FIT_SDK_URL = 'https://cdn.jsdelivr.net/npm/@garmin/fitsdk@21.217.0/src/index.js';
let fitSdkPromise = null;

function loadFitSdk() {
    if (!fitSdkPromise) {
        fitSdkPromise = import(FIT_SDK_URL).catch(error => {
            fitSdkPromise = null; // allow a retry after a network error
            throw error;
        });
    }
    return fitSdkPromise;
}

async function parseFIT(arrayBuffer) {
    let sdk;
    try {
        sdk = await loadFitSdk();
    } catch (error) {
        console.error('Failed to load FIT SDK:', error);
        const message = t('notify.fitModuleFailed');
        // Several FIT files in one upload should not stack identical notifications
        if (![...document.querySelectorAll('.notification')].some(n => n.textContent === message)) {
            showNotification(message, 'info', 5000);
        }
        return null;
    }
    const { Decoder, Stream } = sdk;

    const checker = new Decoder(Stream.fromArrayBuffer(arrayBuffer));
    if (!checker.isFIT() || !checker.checkIntegrity()) {
        console.error('Not a valid FIT file or the file is damaged');
        return null;
    }

    const { messages, errors } = new Decoder(Stream.fromArrayBuffer(arrayBuffer))
        .read({ convertTypesToStrings: true });
    if (errors.length > 0) {
        console.warn('FIT decode errors:', errors);
    }

    const sessions = messages.sessionMesgs || [];
    const session = sessions[0];
    if (!session) {
        console.warn('No session message in FIT file');
        return null;
    }

    const records = messages.recordMesgs || [];
    const heartRates = records.map(r => r.heartRate).filter(hr => hr > 0);
    const trackPoints = records.map(r => ({
        time: r.timestamp || null,
        heartRate: r.heartRate || 0,
        speed: (r.enhancedSpeed ?? r.speed ?? 0) * 3.6 // m/s to km/h
    }));

    let date = session.startTime || records[0]?.timestamp;
    if (!date) {
        date = new Date();
        console.warn('No date in FIT file, using current date');
    }

    // Multisport files have several sessions; totals cover all of them
    const sum = (field) => sessions.reduce((total, s) => total + (s[field] || 0), 0);
    const duration = sum('totalTimerTime') || sum('totalElapsedTime');
    const calories = sum('totalCalories');

    if (duration === 0 && calories === 0) {
        console.warn('FIT file has no usable data');
        return null;
    }

    const avgHeartRate = session.avgHeartRate || (heartRates.length > 0
        ? Math.round(heartRates.reduce((a, b) => a + b, 0) / heartRates.length)
        : 0);
    const maxHeartRate = session.maxHeartRate || heartRates.reduce((a, b) => Math.max(a, b), 0);
    const minHeartRate = session.minHeartRate || (heartRates.length > 0
        ? heartRates.reduce((a, b) => Math.min(a, b))
        : null);

    // A known sub-sport (badminton) is more specific than the sport (racket)
    const sportKey = SPORTS[session.subSport] ? session.subSport
        : SPORTS[session.sport] ? session.sport
        : null;
    const sport = session.sport || null;

    console.log('Successfully parsed FIT:', {
        date: date.toISOString(),
        sport: `${session.sport}/${session.subSport} -> ${sportKey}`,
        duration,
        calories
    });

    return {
        date,
        sport,
        sportKey,
        duration,
        distance: sum('totalDistance'),
        calories,
        avgHeartRate,
        maxHeartRate,
        heartRates,
        trackPoints,
        source: 'fit',
        // Extra metrics only FIT carries (null when the device does not write them)
        minHeartRate,
        trainingEffect: session.totalTrainingEffect ?? null,
        anaerobicTrainingEffect: session.totalAnaerobicTrainingEffect ?? null,
        trainingLoad: session.trainingLoadPeak ?? null,
        timeInHrZone: session.timeInHrZone ?? null
    };
}

function parseGPX(text) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');

    const parserError = xml.querySelector('parsererror');
    if (parserError) {
        console.error('XML parsing error');
        return null;
    }

    const track = xml.querySelector('trk');
    if (!track) {
        console.warn('No track element found in GPX');
        return null;
    }

    const metadata = xml.querySelector('metadata');
    let date = null;
    if (metadata) {
        const timeElement = metadata.querySelector('time');
        if (timeElement) {
            date = new Date(timeElement.textContent);
            console.log('Date from metadata:', date.toISOString());
        }
    }

    // Get track name (sport type)
    // Zepp uses <n> tag, standard GPX uses <name>
    let nameElement = track.querySelector('name');
    if (!nameElement) {
        nameElement = track.querySelector('n');
    }

    let sport = null;
    if (nameElement) {
        const fullName = nameElement.textContent;
        console.log('GPX track full name:', fullName);

        // Extract sport from Zepp format: "20240722 Outdoor running"
        // or "20250124 Walking"
        const sportMatch = fullName.match(/\d{8}\s+(.+)/);
        if (sportMatch) {
            sport = sportMatch[1]; // "Outdoor running" or "Walking"
        } else {
            sport = fullName;
        }
    }

    const sportKey = sportKeyFromName(sport);
    console.log('GPX track name:', nameElement ? nameElement.textContent : 'not found', '-> sport:', sport, sportKey);

    const trackPoints = xml.querySelectorAll('trkpt');
    if (trackPoints.length === 0) {
        console.warn('No track points found in GPX');
        return null;
    }

    console.log(`Found ${trackPoints.length} track points in GPX`);

    let heartRates = [];
    let maxHeartRate = 0;
    let totalDistance = 0;
    let startTime = null;
    let endTime = null;
    let points = [];
    let prevLat = null;
    let prevLon = null;

    trackPoints.forEach((trkpt, index) => {
        const lat = parseFloat(trkpt.getAttribute('lat'));
        const lon = parseFloat(trkpt.getAttribute('lon'));
        const timeElement = trkpt.querySelector('time');
        const time = timeElement ? new Date(timeElement.textContent) : null;

        if (index === 0 && time) startTime = time;
        if (time) endTime = time;

        let hr = 0;
        const extensions = trkpt.querySelector('extensions');
        if (extensions) {
            const hrElement = extensions.querySelector('hr') || 
                             extensions.querySelector('heartrate') ||
                             extensions.querySelector('[*|hr]');
            if (hrElement) hr = parseInt(hrElement.textContent);
        }

        if (hr > 0 && hr < 250) {
            heartRates.push(hr);
            maxHeartRate = Math.max(maxHeartRate, hr);
        }

        if (prevLat !== null && prevLon !== null) {
            const R = 6371000;
            const dLat = (lat - prevLat) * Math.PI / 180;
            const dLon = (lon - prevLon) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(prevLat * Math.PI/180) * Math.cos(lat * Math.PI/180) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            totalDistance += R * c;
        }

        prevLat = lat;
        prevLon = lon;

        points.push({
            time,
            heartRate: hr,
            speed: 0,
            altitude: parseFloat(trkpt.querySelector('ele')?.textContent || 0)
        });
    });

    const duration = startTime && endTime ? (endTime - startTime) / 1000 : trackPoints.length * 2;
    const avgHeartRate = heartRates.length > 0 ? Math.round(heartRates.reduce((a,b) => a+b, 0) / heartRates.length) : 0;
    const weight = userProfile.weight || 70;
    const durationMinutes = duration / 60;
    const calories = avgHeartRate > 0 ? Math.round(((avgHeartRate * 0.6) - 20) * durationMinutes) : Math.round(durationMinutes * 7);

    if (!date && startTime) {
        date = startTime;
        console.log('Date from first trackpoint:', date.toISOString());
    }

    if (!date) {
        date = new Date();
        console.warn('No date in GPX file, using current date');
    }

    console.log('Successfully parsed GPX:', {
        date: date.toISOString(),
        duration: duration,
        calories: calories,
        avgHeartRate: avgHeartRate,
        trackPoints: trackPoints.length
    });

    return {
        date,
        sport,
        duration,
        distance: totalDistance,
        calories,
        avgHeartRate,
        maxHeartRate,
        heartRates,
        trackPoints: points,
        sportKey
    };
}
