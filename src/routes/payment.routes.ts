
import { paymentController } from "../controllers/payment.controller";
import { deserializeUser } from "../middlewares/auth.middleware";
import express,{Router} from "express";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.post("/create-checkout-session", deserializeUser,requireRole("user"), paymentController.createCheckoutSession);

// Stripe webhook (no auth)
router.post("/webhook", express.raw({ type: "application/json" }), paymentController.stripeWebhook);

export default router;
