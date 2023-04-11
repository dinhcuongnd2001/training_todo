import { useState, useRef } from 'react';
import { Status } from '@/constants';
import { Todo } from '@/interfaces';
import { uuid } from 'uuidv4';

export interface ComponentProps {
  todoList: Todo[];
  setTodolist: React.Dispatch<React.SetStateAction<Todo[]>>;
}

function ComponentAdd({ todoList, setTodolist }: ComponentProps) {
  const [todo, setTodo] = useState<Todo>({ id: uuid(), name: '', score: '', status: Status.CLOSE });
  const status = Object.keys(Status).filter((v) => isNaN(Number(v)));
  const handleSubmit = (data: Todo): void => {
    setTodolist([...todoList, data]);
    setTodo({ id: uuid(), name: '', score: '', status: Status.CLOSE });
  };
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(todo);
        }}
        className="w-[900px] bg-white flex justify-between text-black items-center p-2  pl-[50px] border border-solid border-[#333] mt-2"
      >
        <div className="w-[370px]">
          <input
            className="p-2 border rounded"
            value={todo.name}
            name="name"
            type="text"
            placeholder="Name"
            onChange={(e) => {
              setTodo({ ...todo, [e.target.name]: e.target.value });
            }}
          />
        </div>

        <div className="">
          <input
            className="p-2 border rounded"
            name="score"
            type="text"
            placeholder="Score"
            value={todo.score}
            onChange={(e) => {
              setTodo({ ...todo, [e.target.name]: e.target.value });
            }}
          />
        </div>

        <div className="">
          <label className="mr-3">Status</label>
          <select
            name="status"
            className="cursor-pointer"
            value={todo.status}
            onChange={(e) => {
              setTodo({ ...todo, [e.target.name]: e.target.value });
            }}
          >
            {status.map((x, index) => (
              <option className="p-2" key={index}>
                {x}
              </option>
            ))}
          </select>
        </div>
        <button className="p-2 bg-red-600 rounded text-white">Save</button>
      </form>
    </>
  );
}

export default ComponentAdd;
