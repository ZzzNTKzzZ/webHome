import express from "express";
import { viewShop, addToCart } from "../controllers/shopController.js";

const router = express.Router();

router.get("/", viewShop);
router.post("/add", addToCart);

export default router;

