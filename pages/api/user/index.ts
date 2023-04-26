import nc from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { checkAuth } from '@/utils/middleware';
import { AuthenticatedRequest } from '@/interfaces';
const prisma = new PrismaClient();

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    const { message } = err;
    message ? res.status(401).end(message) : res.status(500).end('something broken');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  },
});

handler.get(checkAuth, async (req: AuthenticatedRequest, res: NextApiResponse, next) => {
  const listUser = await prisma.user.findMany({
    where: {
      NOT: [{ id: req.authorId }],
    },
    select: {
      id: true,
      name: true,
    },
  });
  res.status(200).json(listUser);
});
export default handler;
