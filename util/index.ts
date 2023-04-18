import { TODO_PER_PAGE } from '@/constants';
import { ParamsForGetApi, Todo, ApiResponse } from '@/interfaces';

export const createDueDate = (dueDate: number) => {
  var someDate = new Date();
  var numberOfDaysToAdd = dueDate;
  var result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
  const newDate = new Date(result);
  return `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`;
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
  return listTodo;
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
