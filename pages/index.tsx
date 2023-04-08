import { useState } from 'react';
import { Inter } from 'next/font/google';
import ComponentAdd from '../components/ComponentAdd';
import Todo from '@/components/Todo';

const inter = Inter({ subsets: ['latin'] });
export enum Status {
  TODO = 'TODO',
  CLOSE = 'CLOSE',
  BACKLOG = 'BACKLOG',
}

export interface Todo {
  name: string;
  score: string;
  status: Status;
}

export default function Home() {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [invisibale, setInvisibale] = useState(false);

  const handleAddTodo = () => {
    setInvisibale(true);
  };

  console.log('todolist::', todoList);

  return (
    <main className="w-full h-[100vh] bg-white text-black p-8">
      <table className="w-[500px] text-center">
        <thead>
          <tr>
            <th>#</th>
            <th className="">Name</th>
            <th>Score</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {todoList.length > 0
            ? todoList.map((each, index) => {
                return (
                  <Todo
                    key={index}
                    index={index}
                    name={each.name}
                    score={each.score}
                    status={each.status}
                    todoList={todoList}
                    setTodoList={setTodoList}
                  />
                );
              })
            : null}
        </tbody>
      </table>
      {!invisibale ? <button onClick={handleAddTodo}>+ New task</button> : null}
      {invisibale ? (
        <ComponentAdd todoList={todoList} setTodolist={setTodoList} setInvisibale={setInvisibale} />
      ) : null}
    </main>
  );
}
