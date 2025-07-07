import { OtpRepository } from "../../domain/repositories/OtpRepository";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { generateOtp } from "../../utils/otp.utils";
import { SignupRequestDTO } from "../dtos/auth/SignupRequest.dto";
import { sendOtpEmail } from "../services/MailService";


export class SignupUseCase {
    constructor(
        private userRepo: UserRepository,
        private otpRepo: OtpRepository
    ) { }

    async execute(dto: SignupRequestDTO): Promise<string>{
        const {name, email, dateOfBirth} = dto;
        const user = await this.userRepo.findByEmail(email);
        if(!user){
            await this.userRepo.create({name, email, isVerified: false, provider: 'email', dateOfBirth: new Date(dateOfBirth)});
        }

        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)//10 mins

        await this.otpRepo.createOtp({email, otp, expiresAt});
        await sendOtpEmail(email, otp);
        return 'OTP Sent to mail';
    }
}