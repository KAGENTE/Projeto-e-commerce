import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { AdminController } from "../controllers/admin.controller";
import { OrderController } from "../controllers/orders.controller";

const router = Router();

// Rotas admin protegidas
router.get("/admin/orders", authenticate, adminMiddleware, AdminController.getAllOrders);
router.get("/admin/users", authenticate, adminMiddleware, AdminController.getAllUsers);
router.post("/admin/product", authenticate, adminMiddleware, AdminController.addProduct);
router.get("/user/:userId", authenticate, adminMiddleware, AdminController.listByUserId)
router.put("/admin/editProduct/:id", authenticate,adminMiddleware, AdminController.updateProduct)
router.delete("/admin/product/:id", authenticate, adminMiddleware, AdminController.deleteProduct)


export default router;