import { pool } from "../config/db.js";

// Example: temporary user (for demo)
const userId = 1;

// 🧺 Show cart
export const viewCart = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT c.id AS cartId, p.name, p.price, c.quantity 
     FROM cart_items c
     JOIN products p ON c.product_id = p.id
     WHERE c.user_id = ?`,
    [userId]
  );

  const total = rows.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render("cart", { cart: rows, total: total.toFixed(2) });
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

export const removeFromCart = async (req, res) => {
  const { cart_id } = req.body;
  await pool.query("DELETE FROM cart_items WHERE id = ?", [cart_id]);
  res.redirect("/cart");
};

export const updateQuantity = async (req, res) => {
  const { cart_id, quantity } = req.body;
  await pool.query("UPDATE cart_items SET quantity = ? WHERE id = ?", [
    quantity,
    cart_id,
  ]);
  res.redirect("/cart");
};
