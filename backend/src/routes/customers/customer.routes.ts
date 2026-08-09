import { Router } from "express";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../../controllers/customers/customer.controller";
import { authenticate } from "../../middleware/auth/auth.middleware";

const router = Router();

router.post("/", authenticate, createCustomer);
router.get("/", authenticate, getCustomers);
router.get("/:id", authenticate, getCustomerById);
router.put("/:id", authenticate, updateCustomer);
router.delete("/:id", authenticate, deleteCustomer);

export default router;