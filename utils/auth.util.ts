import jwt from 'jsonwebtoken';

const secret = process.env.PRIVATE_KEY as string;

export const generationToken = (payload: { email: string }) => {
  const token = jwt.sign(payload, '123456', { expiresIn: '1h' });
  return token;
};
