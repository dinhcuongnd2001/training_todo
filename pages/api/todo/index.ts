import nc, { NextHandler } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, AuthenticatedRequest, CreateTodoRequest, Todo } from '@/interfaces';
import { PrismaClient, TodoStatus } from '@prisma/client';
import { TODO_PER_PAGE } from '@/constants';
import { checkAuth, checkUnique } from '@/utils/middleware';

const prisma = new PrismaClient();

const getDataFromDB = async (search: string, page: number, id: number, order: string, status?: TodoStatus) => {
  const statusCondition = status ? { status } : {};

  const listTodo = await prisma.todo.findMany({
    where: {
      name: { contains: search, mode: 'insensitive' },
      ...statusCondition,
      OR: [
        {
          authorId: id,
        },
        {
          assignees_todo: { some: { userId: id } },
        },
      ],
    },

    orderBy: [
      {
        dueDate: order === 'asc' ? 'asc' : 'desc',
      },
      {
        id: order === 'asc' ? 'asc' : 'desc',
      },
    ],
    take: TODO_PER_PAGE,
    skip: (page - 1) * TODO_PER_PAGE,
  });

  const total = await prisma.todo.count({
    where: {
      name: { contains: search, mode: 'insensitive' },
      ...statusCondition,
      OR: [
        {
          authorId: id,
        },
        {
          assignees_todo: { some: { userId: id } },
        },
      ],
    },
    orderBy: [
      {
        dueDate: order === 'asc' ? 'asc' : 'desc',
      },
      {
        id: order === 'asc' ? 'asc' : 'desc',
      },
    ],
  });
  const totalPages = Math.ceil(total / TODO_PER_PAGE);
  return { listTodo, totalPages };
};

const createData = async (data: Todo) => {
  const res = await prisma.todo.create({
    data,
  });
  return res;
};

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    const { message } = err;
    message ? res.status(401).end(message) : res.status(500).end('something broken');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  },
});

handler.get(checkAuth, async (req: AuthenticatedRequest, res: NextApiResponse<ApiResponse>, next) => {
  const { status, search, page, order } = req.query;
  const authorId = req.authorId;

  let newStatus: TodoStatus | undefined;
  if (status !== 'ALL') {
    newStatus = status as TodoStatus;
  }
  const data = await getDataFromDB(String(search), Number(page), authorId, order, newStatus);
  res.status(200).json(data);
});

handler.post(checkAuth, checkUnique, async (req: CreateTodoRequest, res: NextApiResponse<Todo>, next) => {
  const authorId = req.authorId;
  const newTodo = await createData({ ...req.body, authorId });
  res.status(201).json(newTodo);
});

export default handler;
