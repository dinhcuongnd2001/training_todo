import { useState, useRef } from 'react';
import { Status, Todo } from '../pages/index';

export interface ComponentProps {
  todoList: Todo[];
  setTodolist: React.Dispatch<React.SetStateAction<any>>;
  setInvisibale: React.Dispatch<React.SetStateAction<any>>;
}

function ComponentAdd({ todoList, setTodolist, setInvisibale }: ComponentProps) {
  const [todo, setTodo] = useState<Todo>({ name: '', score: '', status: Status.CLOSE });
  const status = Object.keys(Status).filter((v) => isNaN(Number(v)));
  const handleSubmit = (data: Todo) => {
    setTodolist([...todoList, data]);
    setInvisibale(false);
  };
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(todo);
        }}
        className="w-full bg-white flex flex-3 text-black items-center p-2"
      >
        <div className="">
          <label className="mr-3">name</label>
          <input
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
          <label className="mr-3">Score</label>
          <input
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
            value={todo.status}
            onChange={(e) => {
              setTodo({ ...todo, [e.target.name]: e.target.value });
            }}
          >
            {status.map((x, index) => (
              <option key={index}>{x}</option>
            ))}
          </select>
        </div>
        <button className="p-2 bg-red-600 ">Save</button>
      </form>
    </>
  );
}

export default ComponentAdd;
