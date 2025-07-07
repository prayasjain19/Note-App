import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();

router.post('/signup', AuthController.signup);
router.post('/signin', AuthController.signIn);
router.post('/verify-otp', AuthController.verifyOtp);
router.post('/google-login', AuthController.googleLogin);

export default router;
