import { Router } from "express";
import { ReviewController } from "../controllers/reviews.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { generateReviewSummary } from "../middlewares/IA.middleware";

const router = Router();

router.post("/reviews", authenticate, ReviewController.create);
router.get("/products/:productId/reviews", ReviewController.listByProduct);
router.post("/products/:id/IA", generateReviewSummary, ReviewController.getSummary);



export default router;
