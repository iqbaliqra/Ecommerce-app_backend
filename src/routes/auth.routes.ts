import { Router } from 'express';
import { register, login, logout } from '../controllers/auth.controller';
import { deserializeUser } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', deserializeUser, logout);

export default router;
