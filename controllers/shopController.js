import { pool } from "../config/db.js";

const userId = 1; // demo user

export const viewShop = async (req, res) => {
  const [products] = await pool.query("SELECT * FROM products");
  res.render("shop", { products });
};

export const addToCart = async (req, res) => {
  const { product_id } = req.body;

  const [existing] = await pool.query(
    "SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?",
    [userId, product_id]
  );

  if (existing.length > 0) {
    await pool.query(
      "UPDATE cart_items SET quantity = quantity + 1 WHERE id = ?",
      [existing[0].id]
    );
  } else {
    await pool.query(
      "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, 1)",
      [userId, product_id]
    );
  }

  res.redirect("/cart");
};
