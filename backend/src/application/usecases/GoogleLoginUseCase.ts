import { OAuth2Client } from "google-auth-library";
import { GoogleLoginDTO } from "../dtos/auth/GoogleLogin.dto";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { generateJwtToken } from "../../utils/jwt.utils";


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class GoogleLoginUseCase {
    constructor(
        private userRepo: UserRepository
    ) { }

    async execute(dto: GoogleLoginDTO) {
        const ticket = await client.verifyIdToken({
            idToken: dto.token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email || !payload.name) {
            throw new Error('Invalid Google token');
        }

        //Find Existing User
        const existingUser = await this.userRepo.findByEmail(payload.email);
        //Create user
        if (!existingUser) {
            await this.userRepo.create({
                name: payload.name,
                email: payload.email,
                isVerified: true,
                provider: 'google',
            });
        }

        const user = await this.userRepo.findByEmail(payload.email)!;
        if (!user) {
            throw new Error('User not found');
        }
        const token = generateJwtToken({
            userId: user._id!.toString(), // ok to use ! here, since we checked user exists
            email: user.email
        });

        return { token, name: user.name, email: user.email };
    }
}