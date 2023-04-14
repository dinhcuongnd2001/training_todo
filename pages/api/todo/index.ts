import type { NextApiRequest, NextApiResponse } from 'next';
import { Todo } from '@/interfaces';
import { Status } from '@/constants';
import { createDueDate } from '@/util';
import { handleChangeRemove, handleChangeUpdate, handelAddTodo, handleGetTodo } from '@/util';
// data
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

export default function handler(req: NextApiRequest, res: NextApiResponse<Todo[] | {}>) {
  if (req.method == 'GET') {
    console.log('request :: ', req.query);
    const newlistTodo = handleGetTodo(listTodo, req.query);
    console.log('new ::', newlistTodo.length);
    res.status(200).json(newlistTodo);
  }
  if (req.method == 'POST') {
    handelAddTodo(listTodo, req.body);
    res.status(201).json(listTodo);
  }
  if (req.method == 'PUT') {
    handleChangeUpdate(listTodo, req.body);
    res.status(200).json(listTodo);
  }
  if (req.method == 'DELETE') {
    listTodo = handleChangeRemove(listTodo, req.query.id);
    res.status(200).json(listTodo);
  }
}
