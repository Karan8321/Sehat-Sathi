import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let cachedRows = null;

function loadSymptomTriageRows() {
  if (cachedRows) return cachedRows;

  // __dirname is src/services, file lives in project root, so go two levels up
  const csvPath = path.join(
    __dirname,
    "..",
    "..",
    "symptoms_triage_karnataka.csv"
  );
  const raw = fs.readFileSync(csvPath, "utf-8");
  const [headerLine, ...rows] = raw.trim().split(/\r?\n/);
  const headers = headerLine.split(",");

  cachedRows = rows.map((line) => {
    const cols = line.split(",");
    const record = {};
    headers.forEach((h, idx) => {
      record[h.trim()] = (cols[idx] || "").trim();
    });
    return record;
  });

  return cachedRows;
}

// Simple CSV-based mapper: try to find mapped specializations and triage steps
// that best match the free-text symptoms and optional district.
export function inferFromSymptomsCsv(symptomsText, district) {
  const text = (symptomsText || "").toLowerCase();
  const targetDistrict = (district || "").toLowerCase().trim();
  const rows = loadSymptomTriageRows();

  const specialtiesSet = new Set();
  let bestTriageSteps = null;
  let bestScore = -1;

  for (const row of rows) {
    const symptom = (row.Symptom || "").toLowerCase();
    const rowDistrict = (row.District || "").toLowerCase();

    if (!symptom) continue;

    // Basic text overlap scoring
    let score = 0;
    if (text.includes(symptom) || symptom.includes(text)) {
      score += 2;
    }

    if (targetDistrict && rowDistrict === targetDistrict) {
      score += 2;
    }

    if (score <= 0) continue;

    const mappedSpec = (row.Mapped_Specializations || "").trim();
    if (mappedSpec) {
      specialtiesSet.add(mappedSpec);
    }

    if (score > bestScore && row.Triage_Steps) {
      bestScore = score;
      bestTriageSteps = row.Triage_Steps;
    }
  }

  return {
    specialties: Array.from(specialtiesSet),
    triageSteps: bestTriageSteps,
  };
}
