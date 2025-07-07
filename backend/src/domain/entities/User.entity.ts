import { Types } from "mongoose";
export interface User {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string; // Optional if using only OTP/Google
  isVerified: boolean;
  provider?: 'email' | 'google';
  dateOfBirth?: Date; 
}