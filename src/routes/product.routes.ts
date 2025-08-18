import { Router } from 'express';
import {
  createProductHandler,
  getProductsHandler,
  getProductHandler,
  updateProductHandler,
  deleteProductHandler
} from '../controllers/product.controller';
import { deserializeUser } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

// Public routes
router.get('/', deserializeUser,getProductsHandler);
router.get('/:id',deserializeUser, getProductHandler);

// Admin-only routes
router.post('/', deserializeUser, requireRole('admin'), createProductHandler);
router.put('/:id', deserializeUser, requireRole('admin'), updateProductHandler);
router.delete('/:id', deserializeUser, requireRole('admin'), deleteProductHandler);

export default router;
