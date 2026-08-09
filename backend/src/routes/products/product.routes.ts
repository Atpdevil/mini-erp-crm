import { Router } from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../../controllers/products/product.controller";

const router = Router();

// CREATE
router.post("/", createProduct);

// GET ALL
router.get("/", getProducts);

// GET BY ID
router.get("/:id", getProductById);

// UPDATE
router.put("/:id", updateProduct);

// DELETE
router.delete("/:id", deleteProduct);

export default router;