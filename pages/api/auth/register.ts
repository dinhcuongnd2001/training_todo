import nc from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { RegisterDataType } from '@/interfaces';
import bcrypt from 'bcrypt';
import Error from 'next/error';

const prisma = new PrismaClient();

const handleRegister = async (data: RegisterDataType) => {
  const result = await prisma.user.findUnique({ where: { email: data.email } });
  if (result) {
    throw new Error({
      statusCode: 404,
      title: 'The Email has existen',
    });
  }
  const passwordCrypted = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: passwordCrypted,
    },
  });

  return { success: 'true', data: user };
};

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    // console.log('error ::', err);
    res.status(500).end(err);
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  },
});

handler.post(async (req, res: NextApiResponse, next) => {
  try {
    const data = await handleRegister(req.body);
    res.status(200).json({ ...data });
  } catch (error: any) {
    res.status(error.props.statusCode).send({ message: error.props.title });
  }
});

export default handler;
