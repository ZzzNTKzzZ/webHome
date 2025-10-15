import express from "express";
import {
  viewCart,
  addToCart,
  removeFromCart,
  updateQuantity,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", viewCart);
router.post("/add", addToCart);
router.post("/remove", removeFromCart);
router.post("/update", updateQuantity);

export default router;
