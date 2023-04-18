import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, Todo } from '@/interfaces';
import { Status } from '@/constants';
import { createDueDate } from '@/util';
import { handleChangeRemove, handleChangeUpdate, handelAddTodo, handleGetTodo } from '@/util';
import nc from 'next-connect';

let listTodo: Todo[] = [
  {
    id: '1',
    name: 'Học React',
    score: '12',
    desc: 'Học React ',
    status: Status.CLOSE,
    dueDate: createDueDate(4),
  },
  {
    id: '2',
    name: 'Học NextJs',
    score: '12',
    desc: 'Học NextJs ',
    status: Status.CLOSE,
    dueDate: createDueDate(7),
  },
  {
    id: '3',
    name: 'Học Redux',
    score: '13',
    desc: 'Học NextJs ',
    status: Status.CLOSE,
    dueDate: createDueDate(9),
  },
];

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end('Something broke!');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  },
});

handler.get('/api/todo', (req, res: NextApiResponse<ApiResponse>, next) => {
  const data = handleGetTodo(listTodo, req.query);
  res.status(200).json(data);
});

handler.post('/api/todo', (req, res: NextApiResponse<Todo[]>, next) => {
  handelAddTodo(listTodo, req.body);
  res.status(201).json(listTodo);
});

handler.put('api/todo', (req, res: NextApiResponse<Todo[]>, next) => {
  handleChangeUpdate(listTodo, req.body);
  res.status(200).json(listTodo);
});

handler.delete('api/todo/:id', (req, res: NextApiResponse<Todo[]>, next) => {
  listTodo = handleChangeRemove(listTodo, req.query.id);
  res.status(200).json(listTodo);
});

export default handler;
