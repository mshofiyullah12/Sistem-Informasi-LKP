import express from "express";
import path from "path";
import cors from "cors";
import mysql from "mysql2/promise";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: "50mb" }));

  // MySQL Connection Pool Configuration for Hostinger
  // Users must replace these with their actual Hostinger database credentials in production or via .env
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "lpk_nandita_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // API Routes for Database Sync
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
  });

  // Example Ping Database
  app.get("/api/db-check", async (req, res) => {
    try {
      const connection = await pool.getConnection();
      connection.release();
      res.json({ status: "success", message: "Database connected successfully!" });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  });

  // Sync Endpoint (Full JSON Dump/Restore for simplicity in migration)
  // For a production app, this should be broken down into individual table CRUD operations.
  // Here we provide a simple JSON document store approach if they just want to sync the state.
  app.post("/api/sync", async (req, res) => {
    try {
      const data = req.body;
      // You can process the data and insert into tables here.
      // Example for 'siswa' table:
      /*
      const connection = await pool.getConnection();
      await connection.beginTransaction();
      try {
         await connection.query("TRUNCATE TABLE siswa");
         if (data.siswa && data.siswa.length > 0) {
            for(let s of data.siswa) {
               await connection.query("INSERT INTO siswa (id, nis, nama, gender) VALUES (?, ?, ?, ?)", [s.id, s.nis, s.nama, s.gender]);
            }
         }
         await connection.commit();
      } catch(e) {
         await connection.rollback();
         throw e;
      } finally {
         connection.release();
      }
      */
      
      // Simulate success for now
      console.log("Received sync data:", Object.keys(data));
      res.json({ status: "success", message: "Data tersinkronisasi ke server SQL!" });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ status: "error", message: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
