import nc from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Todo } from '@/interfaces';
import listTodo from '@/db';
import { handleChangeRemove } from '@/util';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end('Something broke!');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  },
});

handler.delete((req, res: NextApiResponse<Todo[]>, next) => {
  const id = String(req.query.id);
  handleChangeRemove(listTodo, id);
  res.status(200).json(listTodo);
});

export default handler;
