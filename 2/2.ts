import { DatabaseSync } from "node:sqlite";
import * as fs from "node:fs";
import * as path from "node:path";

const db = new DatabaseSync(":memory:");

const inputPath = path.resolve(import.meta.dirname, "input.txt");
const input = fs.readFileSync(inputPath, { encoding: "utf-8"}).split(/\n/);

db.exec(`CREATE TABLE list (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  val TEXT
)`);

const stmt = db.prepare("INSERT INTO list (val) VALUES (?)");

for (const line of input) {
  for (const val of line.split(" "))
    stmt.run(val);
  stmt.run(null);
}

// stmt.run(null);

// const rows = db.prepare(`SELECT *, 
//    (abs(a - b) BETWEEN 1 AND 3) AND
//         (abs(b - c) BETWEEN 1 AND 3) AND
//         (abs(c - d) BETWEEN 1 AND 3) AND
//         (abs(d - e) BETWEEN 1 AND 3) AND
//         ((a > b AND b > c AND c > d AND d > e) OR
//           (a < b AND b < c AND c < d AND d < e)) as safe FROM list
// `).all();

console.log(db.prepare(`
SELECT count(*) FROM
  (SELECT max(diff) BETWEEN 1 AND 3 AND max(sign) == min(sign) safe FROM 
    (SELECT
      l1.val l1,
      l2.val l2,
      abs(l2.val - l1.val) diff,
      sign(l2.val - l1.val) sign,
      COUNT(CASE WHEN l1.val IS NULL THEN 1 END) OVER (ORDER BY l1.id) AS line
      FROM list l1 LEFT JOIN list l2 ON l1.id + 1 = l2.id)
    GROUP BY line)
  WHERE safe
`).all());
