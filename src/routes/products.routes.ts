import { Router } from 'express';
import { getAllProducts, getProductById, createProduct } from '../controllers/products.controller';

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
export default router;
