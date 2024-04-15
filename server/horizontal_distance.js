function calculateDistance(lat1, lon1, lat2, lon2) {
    const radPerDeg = Math.PI / 180; // PI / 180
    const rkm = 6371;               // Earth radius in kilometers
    const rm = rkm * 1000;          // Radius in meters

    const dlatRad = (loc2[0] - loc1[0]) * radPerDeg; // Delta, converted to rad
    const dlonRad = (loc2[1] - loc1[1]) * radPerDeg;

    const lat1Rad = loc1[0] * radPerDeg;
    const lat2Rad = loc2[0] * radPerDeg;

    const a = Math.sin(dlatRad / 2)**2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dlonRad / 2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (rm * c) ; // Delta in ometers
}


const loc1 = [25.9003558, 72.3924606]; // Location 1 (Berlin, Germany)
const loc2 = [28.67629,77.50232];      // Location 2 (Paris, France)
const distance = calculateDistance(loc1, loc2);
console.log(`Distance: ${distance} Metres`);
