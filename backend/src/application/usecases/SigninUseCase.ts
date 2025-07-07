import { UserRepository } from '../../domain/repositories/UserRepository';
import { OtpRepository } from '../../domain/repositories/OtpRepository';
import { generateOtp } from '../../utils/otp.utils';
import { sendOtpEmail } from '../services/MailService';

export class SigninUseCase {
  constructor(
    private userRepo: UserRepository,
    private otpRepo: OtpRepository
  ) {}

  async execute(email: string): Promise<string> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await this.otpRepo.createOtp({ email, otp, expiresAt });
    await sendOtpEmail(email, otp);

    return 'OTP sent successfully';
  }
}
