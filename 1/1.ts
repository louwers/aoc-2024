import { DatabaseSync } from "node:sqlite";
import * as fs from "node:fs";
import * as path from "node:path";

const db = new DatabaseSync(":memory:");

const inputPath = path.resolve(import.meta.dirname, "input.txt");
const input = fs.readFileSync(inputPath, { encoding: "utf-8"}).split("\n");

db.exec(`CREATE TABLE list (
  a INTEGER,
  b INTEGER  
)`);

const stmt = db.prepare("INSERT INTO list (a, b) VALUES (?, ?)");

for (const [a, b] of input.map(line => line.split(/ +/))) {
  stmt.run(a, b);
}

console.log(db.prepare(`SELECT sum(abs(b - a)) AS sum FROM
  (SELECT a, row_number() OVER (ORDER BY a) as a_idx FROM list),
  (SELECT b, row_number() OVER (ORDER BY b) as b_idx FROM list)
  WHERE a_idx = b_idx
`).all());