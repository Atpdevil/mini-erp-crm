import { Router } from "express";
import { getDashboard } from "../controllers/dashboard/dashboard.controller";
import { authenticate } from "../middleware/auth/auth.middleware";

const router = Router();

router.get("/", authenticate, getDashboard);

export default router;