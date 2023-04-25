import nc, { NextHandler } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, Assignee, AuthenticatedRequest, CreateTodoRequest, Todo } from '@/interfaces';
import { PrismaClient, TodoStatus } from '@prisma/client';
const prisma = new PrismaClient();

interface DetailAssigneeRequest extends NextApiRequest {
  query: {
    todoId: string;
  };
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

handler.get(async (req: DetailAssigneeRequest, res: NextApiResponse, next) => {
  try {
    const result = await prisma.user.findMany({
      where: {
        AND: [
          {
            assignees_todo: { some: { todoId: Number(req.query.todoId) } },
          },
        ],
      },
      select: {
        email: true,
        name: true,
        id: true,
      },
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).end('something broken');
  }
});

export default handler;
