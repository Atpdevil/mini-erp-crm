import "dotenv/config";
import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes";
import errorHandler from "./middleware/errorHandler";
import authRoutes from "./routes/auth/auth.routes";
import customerRoutes from "./routes/customers/customer.routes";
import leadRoutes from "./routes/leads/lead.routes";
import orderRoutes from "./routes/orders/order.routes";
import productRoutes from "./routes/products/product.routes";
import dashboardRoutes from "./routes/dashboard.routes";


const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});