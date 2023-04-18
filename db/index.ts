import { Status } from '@/constants';
import { ApiResponse, Todo } from '@/interfaces';

import { createDueDate } from '@/util';

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

export default listTodo;
