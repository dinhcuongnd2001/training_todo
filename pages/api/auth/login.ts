import nc from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { LoginDataType } from '@/interfaces';
import bcrypt from 'bcrypt';
import Error from 'next/error';

const prisma = new PrismaClient();

const handleLogin = async (data: LoginDataType) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (!user)
    throw new Error({
      statusCode: 400,
      title: 'The Password or Email is not true',
    });
  // compare
  const match = await bcrypt.compare(data.password, user.password);
  if (!match)
    throw new Error({
      statusCode: 400,
      title: 'The Password or Email is not true',
    });

  return;
};
const handler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  },
});

handler.post(async (req, res: NextApiResponse, next) => {
  try {
    const a = await handleLogin(req.body);
    res.status(200).json({ succ: 'true' });
  } catch (error: any) {
    res.status(error.props.statusCode).send({ message: error.props.title });
  }
});

export default handler;
