import { Types } from "mongoose";
export interface Note {
  _id?: Types.ObjectId;
  userId: string;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}