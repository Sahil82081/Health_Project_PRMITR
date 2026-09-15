import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csv from "csv-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(
    __dirname,
    "../data/symptoms.csv"
);

let cachedSymptoms = null;

export async function loadSymptoms() {

    // Don't read the CSV every request
    if (cachedSymptoms) {
        return cachedSymptoms;
    }

    return new Promise((resolve, reject) => {

        const symptoms = new Set();

        fs.createReadStream(csvPath)
            .pipe(csv())
            .on("data", (row) => {

                const symptom = row.symptom?.trim();

                if (symptom) {
                    symptoms.add(symptom);
                }
            })

            .on("end", () => {

                cachedSymptoms = [...symptoms];

                console.log(
                    `Loaded ${cachedSymptoms.length} symptoms`
                );

                resolve(cachedSymptoms);
            })

            .on("error", reject);
    });
}