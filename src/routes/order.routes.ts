import { Router } from "express";
import { orderController } from "../controllers/order.controller";
import { deserializeUser } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

// User routes
router.use(deserializeUser, requireRole("user"));
router.post("/", orderController.createOrder);
router.get("/", orderController.getUserOrders);
router.get("/:id", orderController.getOrderById);
router.put("/:id", orderController.updateShippingAddress);

// Admin routes
router.get("/admin/all", deserializeUser, requireRole("admin"), orderController.getAllOrders);
router.get("/admin/:id", deserializeUser, requireRole("admin"), orderController.getOrderByAdmin);

export default router;
