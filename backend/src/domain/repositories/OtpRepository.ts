import { Otp } from "../entities/Otp.entity";


export interface OtpRepository{
    createOtp(data: Otp): Promise<void>
    findValidOtp(email: string, otp: string): Promise<Otp | null>
    deleteOtp(email: string): Promise<void>
}