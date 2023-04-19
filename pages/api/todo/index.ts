import nc, { NextHandler } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, Todo } from '@/interfaces';
import { handleChangeRemove, handleChangeUpdate, handelAddTodo, handleGetTodo } from '@/util';
import { PrismaClient, TodoStatus } from '@prisma/client';
import { TODO_PER_PAGE } from '@/constants';

const prisma = new PrismaClient();

const getDataFromDB = async (search: string, page: number, status?: TodoStatus) => {
  const statusCondition = status ? { status: { equals: status } } : {};
  const listTodo = await prisma.todo.findMany({
    where: {
      name: { contains: search, mode: 'insensitive' },
      ...statusCondition,
    },
    take: TODO_PER_PAGE,
    skip: (page - 1) * TODO_PER_PAGE,
  });
  const total = await prisma.todo.count({
    where: {
      name: { contains: search, mode: 'insensitive' },
      ...statusCondition,
    },
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
    console.error(err.stack);
    res.status(500).end('Something broken');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  },
});

handler.get(async (req, res: NextApiResponse<ApiResponse>, next) => {
  const { status, search, page } = req.query;
  let newStatus: TodoStatus | undefined;
  if (status !== 'ALL') {
    newStatus = status as TodoStatus;
  }
  const data = await getDataFromDB(String(search), Number(page), newStatus);
  // const data = handleGetTodo(listTodo, req.query);
  res.status(200).json(data);
});

handler.post(async (req, res: NextApiResponse<Todo>, next) => {
  const newTodo = await createData(req.body);
  res.status(201).json(newTodo);
});

export default handler;
