import { Router } from 'express';
import { loginUser } from '../Controllers/userController';

const router = Router();

router.post('/', loginUser);

export default router;
