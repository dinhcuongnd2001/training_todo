import { useState, useEffect } from 'react';
import ComponentAdd from '../components/ComponentAdd';
import TodoComponent from '@/components/TodoComponent';
import { Todo } from '@/interfaces';
import { Status } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/hooks/common';
import { fetchTodoList } from '@/redux/todo.slice';
import Link from 'next/link';
import { useRouter } from 'next/router';
export default function Home() {
  const dispatch = useAppDispatch();
  const todoList = useAppSelector((state) => state.todolist.list);
  const router = useRouter();
  let { status } = router.query;
  status = status ? status : 'ALL';

  const filterTodo = (status: string | string[]): Todo[] => {
    if (status === 'ALL') return todoList;
    return todoList.filter((x) => x.status === status);
  };

  useEffect(() => {
    const list = localStorage.getItem('todoList');
    if (list) {
      const listTodo: Todo[] = JSON.parse(list);
      dispatch(fetchTodoList(listTodo));
    }
  }, []);

  useEffect(() => {
    if (todoList.length) {
      localStorage.setItem('todoList', JSON.stringify(todoList));
    }
  }, [todoList]);

  const getStatus = Object.keys(Status).filter((v) => isNaN(Number(v)));
  const listStatus = ['ALL', ...getStatus];

  return (
    <main className="w-full h-[100vh] bg-white text-black p-8">
      <div className="mb-4">
        {listStatus.map((x, index) => (
          <Link
            key={index}
            className="p-2 mx-2 text-white rounded hover:cursor-pointer hover:opacity-80"
            style={status == x ? { background: 'red' } : { background: '#333' }}
            href={{ pathname: '', query: { status: x } }}
          >
            {x}
          </Link>
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
                return <TodoComponent key={each.id} num={index} todo={each} />;
              })
            : null}
        </tbody>
      </table>
      <ComponentAdd />
    </main>
  );
}
