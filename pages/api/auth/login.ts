import { generationToken } from './../../../utils/auth.util';
import nc from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { LoginDataType } from '@/interfaces';
import bcrypt from 'bcrypt';
import Error from 'next/error';
import cookie from 'cookie';
const prisma = new PrismaClient();

const handleLogin = async (data: LoginDataType) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (!user)
    throw new Error({
      statusCode: 401,
      title: 'The Password or Email is not true',
    });
  // compare
  const match = await bcrypt.compare(data.password, user.password);
  if (!match)
    throw new Error({
      statusCode: 401,
      title: 'The Password or Email is not true',
    });

  const token = generationToken({ id: user.id });
  return { userId: user.id, token };
};

const handler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  },
});

handler.post(async (req, res: NextApiResponse, next) => {
  try {
    const { userId, token } = await handleLogin(req.body);
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, {
        path: '/',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      })
    );
    res.status(200).json({ message: 'success', access_token: token });
  } catch (error: any) {
    res.status(401).send({ message: error });
  }
});

export default handler;
