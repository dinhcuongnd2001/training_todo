import { useState } from 'react';
import ComponentAdd from '../components/ComponentAdd';
import TodoComponent from '@/components/TodoComponent';
import { Todo } from '@/interfaces';
import { Status } from '@/constants';

export default function Home() {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [status, setStatus] = useState<string>('ALL');

  const filterTodo = (status: string): Todo[] => {
    if (status === 'ALL') return todoList;
    return todoList.filter((x) => x.status === status);
  };

  const handleChangeStatus = (status: string): void => {
    setStatus(status);
  };

  const getStatus = Object.keys(Status).filter((v) => isNaN(Number(v)));
  const listStatus = ['ALL', ...getStatus];

  return (
    <main className="w-full h-[100vh] bg-white text-black p-8">
      <div className="mb-4">
        {listStatus.map((x, index) => (
          <button
            key={index}
            onClick={() => handleChangeStatus(x)}
            className="p-2 mx-2 text-white rounded hover:cursor-pointer hover:opacity-80"
            style={status == x ? { background: 'red' } : { background: '#333' }}
          >
            {x}
          </button>
        ))}
      </div>

      <table className="w-[900px] text-left border border-solid border-[#333]">
        <thead>
          <tr>
            <th className="w-[50px]">#</th>
            <th className="w-[400px]">Name</th>
            <th className="w-[300px]">Score</th>
            <th className="w-[150px]">Status</th>
          </tr>
        </thead>

        <tbody>
          {todoList.length > 0
            ? filterTodo(status).map((each, index) => {
                return (
                  <TodoComponent
                    key={each.id}
                    num={index}
                    index={each.id}
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
      <ComponentAdd todoList={todoList} setTodolist={setTodoList} />
    </main>
  );
}
