import { Router } from "express";
import { ReviewController } from "../controllers/reviews.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/reviews", authenticate, ReviewController.create);
router.get("/products/:productId/reviews", ReviewController.listByProduct);


export default router;
