import mongoose from "mongoose";
const otpSchema = new mongoose.Schema({
    email: String,
    otp: String,
    expiresAt:{
        type:Date,
        required: true,
        index:{expires: 0}
    }
}, {timestamps: true})

export const OtpModel = mongoose.model('Otp', otpSchema);