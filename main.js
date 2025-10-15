import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import shopRoutes from "./routes/shopRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    helpers: {
      multiply: (a, b) => (a * b).toFixed(2),
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use("/shop", shopRoutes);
app.use("/cart", cartRoutes);
app.get("/", (req, res) => res.redirect("/shop"));

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
