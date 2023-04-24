import nc, { NextHandler } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, Assignee, AuthenticatedRequest, CreateTodoRequest, Todo } from '@/interfaces';
import { PrismaClient, TodoStatus } from '@prisma/client';
const prisma = new PrismaClient();

const createData = async (data: Assignee) => {
  const res = await prisma.assignee_Todo.create({
    data,
  });
  return res;
};

interface AssgineeRequest extends NextApiRequest {
  body: Assignee;
}

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    const { message } = err;
    message ? res.status(401).end(message) : res.status(500).end('something broken');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  },
});

handler.post(async (req: AssgineeRequest, res: NextApiResponse, next) => {
  const newAssignee = await createData(req.body);
  res.status(201).json(newAssignee);
});

export default handler;
