import { Router } from "express";

import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../../controllers/orders/order.controller";

const router = Router();

router.post("/", createOrder);

router.get("/", getOrders);

router.get("/:id", getOrderById);

router.put("/:id", updateOrder);

router.delete("/:id", deleteOrder);

export default router;