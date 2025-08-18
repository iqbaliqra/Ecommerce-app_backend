import { Router } from 'express';
import { deserializeUser } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import {
  createCategoryHandler,
  getCategoriesHandler,
  updateCategoryHandler,
  deleteCategoryHandler
} from '../controllers/category.controller';

const router = Router();

router.post('/', deserializeUser, requireRole('admin'), createCategoryHandler);
router.put('/:id', deserializeUser, requireRole('admin'), updateCategoryHandler);
router.delete('/:id', deserializeUser, requireRole('admin'), deleteCategoryHandler);


router.get('/', deserializeUser, getCategoriesHandler);

export default router;
