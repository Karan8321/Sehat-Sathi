/**
 * In a real system, this would query a database or external API for
 * nearby hospitals and live availability.
 *
 * For now, this returns mocked data based on the provided coordinates.
 */
export async function findNearbyHospitals({ latitude, longitude, radiusKm }) {
  // TODO: Replace with real geospatial search or external API integration.
  const now = new Date().toISOString();

  return [
    {
      id: "hospital-1",
      name: "City General Hospital",
      distanceKm: 2.1,
      availableBeds: 5,
      emergencyWaitMinutes: 20,
      lastUpdated: now,
      location: { latitude, longitude },
    },
    {
      id: "hospital-2",
      name: "Downtown Urgent Care",
      distanceKm: 4.5,
      availableBeds: 2,
      emergencyWaitMinutes: 10,
      lastUpdated: now,
      location: { latitude: latitude + 0.01, longitude: longitude + 0.01 },
    },
  ];
}


