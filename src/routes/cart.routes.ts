import { Router } from "express";
import { cartController } from "../controllers/cart.controller";
import { deserializeUser } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();


router.use(deserializeUser, requireRole('user'));

router.get("/", cartController.getCart);
router.post("/add", cartController.addToCart);
router.delete("/:productId", cartController.removeFromCart);
router.put("/update", cartController.updateQuantity);

export default router;
