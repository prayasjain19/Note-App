import { Request, Response } from 'express';
import { MongoUserRepository } from '../../infrastructure/db/repositories/MongoUserRepository';
import { MongoOtpRepository } from '../../infrastructure/db/repositories/MongoOtpRepository';
import { SignupUseCase } from '../../application/usecases/SignupUseCase';
import { OtpVerifyUseCase } from '../../application/usecases/OtpVerifyUseCase';
import { GoogleLoginUseCase } from '../../application/usecases/GoogleLoginUseCase';
import { SigninUseCase } from '../../application/usecases/SigninUseCase';
import { RequestHandler } from 'express';




//create MongoUserRepo
const userRepo = new MongoUserRepository();
//create OtpUserRepo
const otpRepo = new MongoOtpRepository();


//Now create object of UseCases and pass these above object work as constructore
const signupUC = new SignupUseCase(userRepo, otpRepo);
const otpVerifyUC = new OtpVerifyUseCase(otpRepo, userRepo);
const googleLoginUC = new GoogleLoginUseCase(userRepo);
const signinUC = new SigninUseCase(userRepo, otpRepo);



//Now Create the Controller containing the Business Login To map to Routes
export const AuthController = {
    signup: async (req: Request, res: Response) => {
        try {
            const message = await signupUC.execute(req.body);
            res.json({ message });
        } catch (err: unknown) {
            res.status(400).json({ error: (err as Error).message });
        }
    },
    signIn: (async (req, res) => {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const message = await signinUC.execute(email);
        res.json({ message });
    }) as RequestHandler,
    verifyOtp: async (req: Request, res: Response) => {
        try {
            const data = await otpVerifyUC.execute(req.body);
            res.json(data);
        } catch (err: unknown) {
            res.status(400).json({ error: (err as Error).message });
        }
    },
    googleLogin: async (req: Request, res: Response) => {
        try {
            const data = await googleLoginUC.execute(req.body);
            res.json(data);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }
}
