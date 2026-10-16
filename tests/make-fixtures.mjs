// Writes the synthetic workout files in fixtures/ (no real person's data).
// TCX/GPX are plain text; the FIT file is encoded with the Garmin FIT SDK.
import { writeFileSync } from 'node:fs';
import { Encoder, Profile } from '@garmin/fitsdk';

const dir = new URL('./fixtures/', import.meta.url);

// Heart rate that rises from 95 to ~160 and back, one sample per second
const pulse = (i, seconds) => Math.round(95 + 65 * Math.sin(Math.PI * i / seconds));

function trackpoints(start, seconds) {
    let out = '';
    for (let i = 0; i < seconds; i += 10) {
        const time = new Date(start.getTime() + i * 1000).toISOString();
        out += `<Trackpoint><Time>${time}</Time><HeartRateBpm><Value>${pulse(i, seconds)}</Value></HeartRateBpm></Trackpoint>\n`;
    }
    return out;
}

function tcx({ start, seconds, calories, notes, withId = true }) {
    const iso = start.toISOString();
    return `<?xml version="1.0" encoding="UTF-8"?>
<TrainingCenterDatabase xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2">
<Activities><Activity Sport="Other">${withId ? `<Id>${iso}</Id>` : ''}<Notes>${notes}</Notes>
<Lap StartTime="${iso}"><TotalTimeSeconds>${seconds}</TotalTimeSeconds><DistanceMeters>0</DistanceMeters><Calories>${calories}</Calories>
<Track>
${trackpoints(start, seconds)}</Track></Lap></Activity></Activities></TrainingCenterDatabase>
`;
}

// Badminton, 23.09 18:00 UTC, 60 min - also written as FIT below (a duplicate on purpose)
const badmintonStart = new Date('2026-09-23T18:00:00Z');
writeFileSync(new URL('badminton.tcx', dir), tcx({ start: badmintonStart, seconds: 3600, calories: 650, notes: 'Бадминтон' }));

// Interval training without <Id>: the date must come from the lap
writeFileSync(new URL('interval-no-id.tcx', dir), tcx({
    start: new Date('2026-09-21T07:30:00Z'), seconds: 1200, calories: 180,
    notes: 'Силовой тренинг Интервальная тренировка', withId: false
}));

// Walk as GPX with heart rate in the Garmin track point extension
{
    const start = new Date('2026-09-20T09:00:00Z');
    let points = '';
    for (let i = 0; i <= 2700; i += 30) {
        const time = new Date(start.getTime() + i * 1000).toISOString();
        points += `<trkpt lat="${(59.437 + i / 1e6).toFixed(6)}" lon="${(24.7536 + i / 1e6).toFixed(6)}"><time>${time}</time>`
            + `<extensions><gpxtpx:TrackPointExtension><gpxtpx:hr>${100 + (i % 20)}</gpxtpx:hr></gpxtpx:TrackPointExtension></extensions></trkpt>\n`;
    }
    writeFileSync(new URL('walk.gpx', dir), `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="fixture" xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1">
<metadata><time>${start.toISOString()}</time></metadata>
<trk><name>20260920 Walking</name><trkseg>
${points}</trkseg></trk></gpx>
`);
}

// The badminton workout as FIT, with what only FIT carries: sport/sub-sport, training effect, load
{
    const seconds = 3600;
    const encoder = new Encoder();
    encoder.onMesg(Profile.MesgNum.FILE_ID, {
        type: 'activity', manufacturer: 'development', product: 0, timeCreated: badmintonStart
    });
    for (let i = 0; i < seconds; i += 10) {
        encoder.onMesg(Profile.MesgNum.RECORD, {
            timestamp: new Date(badmintonStart.getTime() + i * 1000), heartRate: pulse(i, seconds)
        });
    }
    const end = new Date(badmintonStart.getTime() + seconds * 1000);
    encoder.onMesg(Profile.MesgNum.SESSION, {
        timestamp: end, startTime: badmintonStart, sport: 'racket', subSport: 'badminton',
        totalTimerTime: seconds, totalElapsedTime: seconds, totalDistance: 0, totalCalories: 650,
        avgHeartRate: 136, maxHeartRate: 160, minHeartRate: 95,
        totalTrainingEffect: 3.8, totalAnaerobicTrainingEffect: 2.4, trainingLoadPeak: 180
    });
    encoder.onMesg(Profile.MesgNum.ACTIVITY, { timestamp: end, numSessions: 1, totalTimerTime: seconds });
    writeFileSync(new URL('badminton.fit', dir), encoder.close());
}

console.log('fixtures written');
