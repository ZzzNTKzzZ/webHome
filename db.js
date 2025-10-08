import mysql2 from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config()

const pool = mysql2.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
});


export async function connectToDb() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected to MySQL database!");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
}

export async function addTask(title, due) {
    
}

export default pool;