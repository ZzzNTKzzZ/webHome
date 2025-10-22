const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

const DATA_FILE = path.join(__dirname, "data.json");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.render("register", { error: "All fields are required!" });
  }

  let users = [];
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE);
    users = JSON.parse(data);
  }

  if (users.some(u => u.email === email)) {
    return res.render("register", { error: "Email already registered!" });
  }

  users.push({ name, email, password });
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));

  res.render("success", { name });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
