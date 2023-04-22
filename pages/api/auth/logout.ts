import nc from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    res.status(500).end(err);
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  },
});
handler.get(async (req, res: NextApiResponse, next) => {});

export default handler;
