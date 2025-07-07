import { Otp } from "../../../domain/entities/Otp.entity";
import { OtpRepository } from "../../../domain/repositories/OtpRepository";
import { OtpModel } from "../models/OtpModel";

function sanitizeOtp(data: any): Otp {
    return {
        ...data,
        _id: data._id.toString(), // convert to string for frontend, optional
    };
}

export class MongoOtpRepository implements OtpRepository {
    async createOtp(data: Otp): Promise<void> {
        await OtpModel.create(data);
    }

    async findValidOtp(email: string, otp: string): Promise<Otp | null> {
        const result = await OtpModel.findOne({
            email,
            otp,
            expiresAt: { $gt: new Date() }
        }).lean();

        return result ? sanitizeOtp(result) : null;
    }
    async deleteOtp(email: string): Promise<void> {
        await OtpModel.deleteMany({ email });
    }
}