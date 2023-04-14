import { ParamsForGetApi, Todo } from '@/interfaces';

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
  }: Partial<{
    [key: string]: string | string[];
  }>
) => {
  if (status === 'ALL' || status == undefined) {
    console.count('-------------------------');
    console.log('status ::', status);
    console.log('search ::', search);

    if (search == undefined || search == '') return listTodo;
    return listTodo.filter((x) => search && x.name.toLocaleLowerCase().includes(search.toString().toLocaleLowerCase()));
  } else {
    if (search == undefined) return listTodo.filter((x) => x.status === status);
    return listTodo.filter(
      (x) => search && x.status == status && x.name.toLocaleLowerCase().includes(search.toString().toLocaleLowerCase())
    );
  }
};
