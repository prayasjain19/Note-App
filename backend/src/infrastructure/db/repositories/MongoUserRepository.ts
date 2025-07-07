import { UserModel } from '../models/UserModel';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { User } from '../../../domain/entities/User.entity';

function sanitizeUser(user: any): User {
  return {
    ...user,
    _id: user._id.toString(),
    dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
  };
}
export class MongoUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email }).lean();
    return user ? sanitizeUser(user) : null;
  }

  async create(user: User): Promise<User> {
    const created = await UserModel.create(user);
    return sanitizeUser(created.toObject());
  }
}
