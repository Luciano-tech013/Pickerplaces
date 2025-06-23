import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "database.json"); // Especifica el archivo de la base de datos

export function readDatabase() {
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data);
}

export function writeDatabase(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
}