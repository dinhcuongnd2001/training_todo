import { TODO_PER_PAGE } from '@/constants';
import { ParamsForGetApi, Todo, ApiResponse } from '@/interfaces';

export const createDueDate = (dueDate = 5) => {
  var someDate = new Date();
  var result = someDate.setDate(someDate.getDate() + dueDate);
  const newDate = new Date(result);
  return newDate.toLocaleDateString('en-US');
};

export const formatDate = (datetime: string) => {
  return new Date(datetime).toLocaleDateString('en-US');
};

export const handelAddTodo = (listTodo: Todo[], param: Todo) => {
  listTodo.push(param);
};

export const handleChangeUpdate = (listTodo: Todo[], param: Todo) => {
  const index = listTodo.findIndex((x) => x.id == param.id);
  listTodo[index] = param;
};

export const handleChangeRemove = (listTodo: Todo[], id: any) => {
  listTodo = listTodo.filter((x) => x.id != id);
};

export const handleGetTodo = (
  listTodo: Todo[],
  {
    status,
    search,
    page,
  }: Partial<{
    [key: string]: string | string[];
  }>
): ApiResponse => {
  let newTodo: Todo[] = [...listTodo];

  if (search) {
    newTodo = newTodo.filter((x) => x.name.toLocaleLowerCase().includes(search.toString().toLocaleLowerCase()));
  }
  if (status && status !== 'ALL') {
    newTodo = newTodo.filter((x) => x.status === status);
  }
  const totalPages = Math.ceil(newTodo.length / TODO_PER_PAGE);
  const data = {
    totalPages,
    listTodo: newTodo.slice((Number(page) - 1) * TODO_PER_PAGE, Number(page) * TODO_PER_PAGE),
  };
  return data;
};

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
