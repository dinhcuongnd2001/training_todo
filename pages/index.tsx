import { useState, useEffect, useLayoutEffect, ChangeEvent, useRef } from 'react';
import ComponentAdd from '../components/ComponentAdd';
import TodoComponent from '@/components/TodoComponent';
import { Todo } from '@/interfaces';
import { Status } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/hooks/common';
import { fetchTodoList } from '@/redux/todo.slice';
import { useRouter } from 'next/router';
import { debounce } from 'lodash';
export default function Home() {
  const dispatch = useAppDispatch();
  const todoList = useAppSelector((state) => state.todolist.list);
  const router = useRouter();
  let { status, search } = router.query;
  status = status ? status : 'ALL';
  search = search ? search : '';
  const [filter, setFilter] = useState<string>('');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const filterTodo = (status: string | string[], search: string | string[]): Todo[] => {
    if (status === 'ALL') {
      if (search == '') return todoList;
      return todoList.filter((x) => x.name.toLocaleLowerCase().includes(search.toString().toLocaleLowerCase()));
    } else {
      if (search == '') return todoList.filter((x) => x.status === status);
      return todoList.filter(
        (x) => x.status == status && x.name.toLocaleLowerCase().includes(search.toString().toLocaleLowerCase())
      );
    }
  };

  const handleChangeStatus = (status: string) => {
    router.query.status = status;
    router.push({
      query: {
        ...router.query,
        status,
      },
    });
  };

  const handleChangeFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const stringSearch = e.target.value.trim();
    const { search, ...rest } = router.query;
    const queryStore = stringSearch
      ? {
          ...rest,
          search: stringSearch,
        }
      : { ...rest };

    const debounceFn = debounce(() => {
      router.push({
        query: queryStore,
      });
    }, 300);
    setFilter(stringSearch);
    debounceFn();
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    const list = localStorage.getItem('todoList');
    if (list) {
      const listTodo: Todo[] = JSON.parse(list);
      dispatch(fetchTodoList(listTodo));
    }
  }, []);

  // lan cuoi chua xoa dc
  useEffect(() => {
    if (todoList.length) {
      localStorage.setItem('todoList', JSON.stringify(todoList));
    }
  }, [todoList]);

  const getStatus = Object.keys(Status).filter((v) => isNaN(Number(v)));
  const listStatus = ['ALL', ...getStatus];

  return (
    <main className="w-full h-[100vh] bg-white text-black p-8">
      <div className="mb-4 flex items-center">
        <div>
          {listStatus.map((x, index) => (
            <button
              onClick={() => handleChangeStatus(x)}
              key={index}
              className="p-2 mx-2 text-white rounded hover:cursor-pointer hover:opacity-80"
              style={status == x ? { background: 'red' } : { background: '#333' }}
            >
              {x}
            </button>
          ))}
        </div>
        <div>
          <input
            placeholder="Input to search"
            className="p-1 ml-4 border border-[#333] "
            type="text"
            value={filter}
            onChange={handleChangeFilter}
          />
        </div>
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
            ? filterTodo(status, search).map((each, index) => {
                return <TodoComponent key={each.id} num={index} todo={each} />;
              })
            : null}
        </tbody>
      </table>

      <button onClick={handleOpenModal} className="p-3 bg-red-500 text-white mt-5">
        +
      </button>
      {openModal ? <ComponentAdd openModal={openModal} setOpenModal={setOpenModal} setFilter={setFilter} /> : null}
    </main>
  );
}
