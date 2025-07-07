import { User } from "../entities/User.entity";

export interface UserRepository {
    findByEmail(email: string): Promise<User | null>
    create(user:User): Promise<User>
}