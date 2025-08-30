import express from "express";
import sqlite3pkg from "sqlite3";
import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { URL } from "url";
import { fileURLToPath } from "url";

const { Database } = sqlite3pkg; // destructure Database from CommonJS default export

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Function to download image from URL and save it locally
function downloadImage(imageUrl: string, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const url = new URL(imageUrl);
      const protocol = url.protocol === 'https:' ? https : http;
      
      // Create the images directory if it doesn't exist
      const imagesDir = path.join(__dirname, '../public/images');
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
      }
      
      const filePath = path.join(imagesDir, filename);
      const file = fs.createWriteStream(filePath);
      
      protocol.get(imageUrl, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download image: ${response.statusCode}`));
          return;
        }
        
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          resolve(`/images/${filename}`); // Return relative path for database storage
        });
        
        file.on('error', (err) => {
          fs.unlink(filePath, () => {}); // Delete the file async
          reject(err);
        });
      }).on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
}

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
    const { code, name, series, gen, event, version, gif, "3d": is3d, image } = req.body;

    console.log(req.body);
    if (!code || !name || !series || !gen || !event || !version || !image) {
      return res.status(400).json({ message: "You have to fill all fields!" });
    }

    const isGif = gif ? 1 : 0;
    const is3dValue = is3d ? 1 : 0;
    const versionNum = Number(version);

    console.log(isGif);

    const result = await runQuery(
      db,
      "INSERT INTO cards (code, name, series, gen, event, version, gif, \"3d\", image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [code, name, series, gen, event, versionNum, isGif, is3dValue, image]
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

// API endpoint for Discord bot to insert card data
router.post("/bot", async (req, res) => {
  try {
    const db = req.app.locals.db as InstanceType<typeof Database>;
    const { code, name, series, gen, version, event, "3d": is3d, gif, image } = req.body;

    console.log("Bot API request body:", req.body);

    // Validate required fields (excluding owner as specified)
    // Note: event can be empty string, so we check for undefined rather than falsy
    if (!code || !name || !series || gen === undefined || version === undefined || event === undefined || !image || gif === undefined || is3d === undefined) {
      return res.status(400).json({
        message: "Missing required fields. Required: code, name, series, gen, version, event, image, gif, 3d"
      });
    }

    // Check if card with this code already exists
    const existingCard = await new Promise<any>((resolve, reject) => {
      db.get(
        "SELECT * FROM cards WHERE code = ?",
        [code],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (existingCard) {
      return res.status(409).json({
        success: false,
        message: `Card with code "${code}" already exists in the database`,
        existingCard: existingCard
      });
    }

    // Download the image and get the local path
    let localImagePath: string;
    try {
      // Create filename based on card code and detect extension from URL
      const imageUrl = new URL(image);
      const originalExt = path.extname(imageUrl.pathname) || '.jpg';
      const filename = `${code}${originalExt}`;
      
      console.log(`Downloading image for card ${code} from ${image}`);
      localImagePath = await downloadImage(image, filename);
      console.log(`Image downloaded successfully: ${localImagePath}`);
    } catch (downloadError: any) {
      console.error("Failed to download image:", downloadError);
      return res.status(400).json({
        success: false,
        message: `Failed to download image: ${downloadError.message}`
      });
    }

    // Convert boolean/number values to appropriate database format
    const isGif = gif ? 1 : 0;
    const is3dValue = is3d ? 1 : 0;
    const versionNum = Number(version);
    const genNum = Number(gen);

    const result = await runQuery(
      db,
      "INSERT INTO cards (code, name, series, gen, event, version, gif, \"3d\", image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [code, name, series, genNum, event, versionNum, isGif, is3dValue, localImagePath]
    );

    // Get the newly inserted card
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

    console.log("Successfully inserted card:", newCard);

    res.status(201).json({
      success: true,
      message: "Card successfully added to database",
      card: newCard
    });
  } catch (err: any) {
    console.error("Bot API error:", err);
    
    res.status(500).json({ 
      success: false,
      message: err.message || "Internal Server Error" 
    });
  }
});

export default router;
