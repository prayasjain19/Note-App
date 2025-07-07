import jwt from 'jsonwebtoken';

interface Payload {
  userId: string;
  email: string;
}

export const generateJwtToken = (payload: Payload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
};
