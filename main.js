import express from "express";
import dotenv from "dotenv";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import pool, { connectToDb } from "./db.js";
import hbs from "hbs";
connectToDb();

dotenv.config();
const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.engine("handlebars", engine());
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "Views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

hbs.registerHelper("ifCond", function (v1, operator, v2, options) {
  switch (operator) {
    case "==":
      return v1 == v2 ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});

app.get("/", async (req, res) => {
  const [tasks] = await pool.query(
    "SELECT * FROM tasks ORDER BY completed, createdAt DESC"
  );
  res.render("home", { layout: "layouts/main", tasks });
});

app.post("/add", async (req, res) => {
  const { title, dueDate, priority } = req.body;
  const sql = `
    INSERT INTO tasks(title, dueDate, priority)
    VALUES (?, ?, ?)
  `;
  await pool.query(sql, [title, dueDate || null, priority || "normal"]);
  res.redirect("/");
});

app.post("/toggle/:id", async (req, res) => {
  const id = req.params.id;
  const sql = `
  UPDATE tasks SET completed = NOT completed WHERE id = ?
  `;
  await pool.query(sql, [id]);

  res.redirect("/");
});

app.post("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await pool.query("DELETE FROM tasks WHERE id = ?", [id]);
  res.redirect("/");
});

app.post("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const { title, dueDate, priority } = req.body;
  const sql =
    "UPDATE tasks SET title = ?, dueDate = ?, priority = ? WHERE id = ?";
  await pool.query(sql, [title, dueDate || null, priority, id]);
  res.redirect("/");
});

app.post("/delete/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM tasks WHERE id = ?", [id]);
  res.redirect("/");
});
// Run App
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
