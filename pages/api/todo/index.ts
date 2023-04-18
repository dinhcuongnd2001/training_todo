import nc, { NextHandler } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, Todo } from '@/interfaces';
import { handleChangeRemove, handleChangeUpdate, handelAddTodo, handleGetTodo } from '@/util';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getDataFromDB = async () => {
  const listTodo = await prisma.todo.findMany();
  return listTodo;
};

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end('Something broke!');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  },
});

handler.get(async (req, res: NextApiResponse<ApiResponse>, next) => {
  const listTodo = await getDataFromDB();
  const data = handleGetTodo(listTodo, req.query);
  res.status(200).json(data);
});

handler.post('/api/todo', async (req, res: NextApiResponse<Todo[]>, next) => {
  // handelAddTodo(listTodo, req.body);
  // res.status(201).json(listTodo);
});

// handler.put('api/todo', (req, res: NextApiResponse<Todo[]>, next) => {
//   handleChangeUpdate(listTodo, req.body);
//   res.status(200).json(listTodo);
// });

// handler.delete('api/todo', (req, res: NextApiResponse<Todo[]>, next) => {
//   handleChangeRemove(listTodo, req.query.id);
//   res.status(200).json(listTodo);
// });

export default handler;
