import { OtpRepository } from "../../domain/repositories/OtpRepository";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { UserModel } from "../../infrastructure/db/models/UserModel";
import { generateJwtToken } from "../../utils/jwt.utils";
import { AuthResponseDTO } from "../dtos/auth/AuthResponse.dto";
import { OtpVerifyRequestDTO } from "../dtos/auth/OtpVerifyRequest.dto";

export class OtpVerifyUseCase {
    constructor(
        private otpRepo: OtpRepository,
        private userRepo: UserRepository
    ) { }

    async execute(dto: OtpVerifyRequestDTO): Promise<AuthResponseDTO> {
        const { email, otp } = dto;

        const validOtp = await this.otpRepo.findValidOtp(email, otp);
        if (!validOtp) throw new Error('Invalid or Expire Otp');

        const user = await this.userRepo.findByEmail(email);
        if (!user) throw new Error('User not found');

        await this.otpRepo.deleteOtp(email);
        //Verify The User
        user.isVerified = true;

        // Use Mongoose directly or create update method in repo
        await UserModel.updateOne({ email }, { isVerified: true });

        const token = generateJwtToken({ userId: user._id!.toString(), email: user.email });
        return { token, name: user.name, email: user.email };

    }
}