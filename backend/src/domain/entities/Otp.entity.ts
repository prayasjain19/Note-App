import { Types } from "mongoose";
export interface Otp {
  _id?: Types.ObjectId;
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt?: Date;
}
