import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    provider: { type: String, enum: ['email', 'google'], default: 'email' },
    dateOfBirth: { type: Date },
    
}, {timestamps: true})
export const UserModel = mongoose.model('User', userSchema);