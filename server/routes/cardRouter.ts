import express from "express";
import sqlite3pkg from "sqlite3";

const { Database } = sqlite3pkg; // destructure Database from CommonJS default export

const router = express.Router();

function runQuery(
  db: InstanceType<typeof Database>,
  sql: string,
  params: any[] = []
): Promise<{ lastID: number }> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID });
    });
  });
}

router.get("/", async (req, res) => {
  try {
    const db = req.app.locals.db as InstanceType<typeof Database>;

    db.all("SELECT * FROM cards", [], (err, rows) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      console.log(rows);
      res.json(rows);
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const db = req.app.locals.db as InstanceType<typeof Database>;
    const { code, name, series, gen, event, version, gif, image } = req.body;

    console.log(req.body);
    if (!code || !name || !series || !gen || !event || !version || !image) {
      return res.status(400).json({ message: "You have to fill all fields!" });
    }

    const isGif = gif ? 1 : 0;
    // Keep version as string to match database schema
    const versionStr = version;

    console.log(isGif);

    const result = await runQuery(
      db,
      "INSERT INTO cards (code, name, series, gen, event, version, gif, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [code, name, series, gen, event, versionStr, isGif, image]
    );

    const newCard = await new Promise<any>((resolve, reject) => {
      db.get(
        "SELECT * FROM cards WHERE rowid = last_insert_rowid()",
        [],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    console.log(res);

    res.status(201).json(newCard);
  } catch (err: any) {
    console.error(err); // <--- this shows why 500 happened
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
});

export default router;
