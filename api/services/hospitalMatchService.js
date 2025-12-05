import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let cachedHospitals = null;

function loadHospitals() {
  if (cachedHospitals) return cachedHospitals;

  const csvPath = path.join(
    __dirname,
    "..",
    "karnataka_semiurban_hospitals_big_dataset.csv"
  );
  const raw = fs.readFileSync(csvPath, "utf-8");
  const [headerLine, ...rows] = raw.trim().split(/\r?\n/);
  const headers = headerLine.split(",");

  cachedHospitals = rows.map((line) => {
    const cols = line.split(",");
    const record = {};
    headers.forEach((h, idx) => {
      record[h.trim()] = (cols[idx] || "").trim();
    });
    return record;
  });

  return cachedHospitals;
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function matchHospitals({ specialties, urgency, district, taluk, userLat, userLng }) {
  const hospitals = loadHospitals();
  const needed = (specialties || []).map((s) => s.toLowerCase());
  const targetDistrict = (district || "").toLowerCase().trim();
  const targetTaluk = (taluk || "").toLowerCase().trim();
  const userLatNum = userLat != null ? Number(userLat) : null;
  const userLngNum = userLng != null ? Number(userLng) : null;

  let scored = hospitals.map((h) => {
    const primary = (h.Primary_Specialization || "").toLowerCase();
    const list = (h.Specializations_List || "").toLowerCase();

    const hospDistrict = (h.District || "").toLowerCase();
    const hospTaluk = (h.Taluk || "").toLowerCase();

    let specialtyScore = 0;
    needed.forEach((s) => {
      if (!s) return;
      if (primary.includes(s)) specialtyScore += 3;
      if (list.includes(s)) specialtyScore += 1;
    });

    // Location relevance
    let locationScore = 0;
    if (targetDistrict && hospDistrict === targetDistrict) {
      locationScore += 3;
    } else if (targetDistrict && hospDistrict.includes(targetDistrict)) {
      locationScore += 2;
    }

    if (targetTaluk && hospTaluk === targetTaluk) {
      locationScore += 4;
    } else if (targetTaluk && hospTaluk.includes(targetTaluk)) {
      locationScore += 3;
    }

    const totalBeds = Number(h.Total_Beds || 0) || 0;
    const icuBeds = Number(h.ICU_Beds || 0) || 0;
    const oxygenBeds = Number(h.Oxygen_Beds || 0) || 0;

    let distanceKm = null;
    const lat = Number(h.Latitude || 0);
    const lng = Number(h.Longitude || 0);
    if (
      userLatNum != null &&
      userLngNum != null &&
      !Number.isNaN(lat) &&
      !Number.isNaN(lng)
    ) {
      distanceKm = haversineKm(userLatNum, userLngNum, lat, lng);
    }

    return {
      hospital: h,
      score: specialtyScore + locationScore,
      specialtyScore,
      locationScore,
      totalBeds,
      icuBeds,
      oxygenBeds,
      distanceKm,
    };
  });

  // Keep only hospitals that actually have beds; allow low scores so
  // we still surface more of the dataset, but sort by score later.
  scored = scored.filter((x) => x.icuBeds > 0 || x.totalBeds > 0);

  // If user specified a district / taluk, hard-filter to that location.
  // TALUK is primary: if both are given, we narrow by taluk first, then district.
  if (targetTaluk) {
    const talukFiltered = scored.filter((x) => {
      const hospTaluk = (x.hospital.Taluk || "").toLowerCase();
      return hospTaluk === targetTaluk || hospTaluk.includes(targetTaluk);
    });
    if (talukFiltered.length) {
      scored = talukFiltered;
    }
  }

  if (targetDistrict) {
    const districtFiltered = scored.filter((x) => {
      const hospDistrict = (x.hospital.District || "").toLowerCase();
      return (
        hospDistrict === targetDistrict ||
        hospDistrict.includes(targetDistrict)
      );
    });
    if (districtFiltered.length) {
      scored = districtFiltered;
    }
  }

  // Sort by: symptom match (specialtyScore>0), then distance (if available),
  // then overall score (symptoms + location), then ICU beds, oxygen beds, total beds.
  scored.sort((a, b) => {
    const aHasSpec = a.specialtyScore > 0 ? 1 : 0;
    const bHasSpec = b.specialtyScore > 0 ? 1 : 0;
    if (bHasSpec !== aHasSpec) return bHasSpec - aHasSpec;

    const aDist = a.distanceKm == null ? Number.POSITIVE_INFINITY : a.distanceKm;
    const bDist = b.distanceKm == null ? Number.POSITIVE_INFINITY : b.distanceKm;
    if (aDist !== bDist) return aDist - bDist;

    if (b.score !== a.score) return b.score - a.score;
    if (b.icuBeds !== a.icuBeds) return b.icuBeds - a.icuBeds;
    if (b.oxygenBeds !== a.oxygenBeds) return b.oxygenBeds - a.oxygenBeds;
    return b.totalBeds - a.totalBeds;
  });

  // Return all scored hospitals; the route will apply maxResults.
  return scored.map((x) => ({
    ...x.hospital,
    Distance_km:
      x.distanceKm == null || Number.isNaN(x.distanceKm)
        ? ""
        : x.distanceKm.toFixed(1),
  }));
}
