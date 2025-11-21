import { Router } from "express";
import { OrderController } from "../controllers/orders.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/order", authenticate, OrderController.create);
router.get("/order", authenticate, OrderController.list);
router.get("/order/:id", authenticate, OrderController.get);
router.get("/my-orders", authenticate, OrderController.listByUser);

export default router;
