import { useState, useEffect, useLayoutEffect, ChangeEvent, useRef } from 'react';
import ComponentAdd from '../components/ComponentAdd';
import TodoComponent from '@/components/TodoComponent';
import Panigation from '@/components/pagination';
import { Status } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/hooks/common';
import { fetchTodoList } from '@/redux/todo.slice';
import { useRouter } from 'next/router';
import { debounce } from 'lodash';
import ApiHandle from '../service';
export default function Home() {
  const [filter, setFilter] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [checkUpdate, setCheckUpdate] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const todoList = useAppSelector((state) => state.todolist.list);
  const router = useRouter();
  const todosPerPage = 2;
  const numPageShow = 5;
  const nearPage = 2;
  let { status, search, page } = router.query;
  status = status ? String(status) : 'ALL';
  search = search ? String(search) : '';
  page = page ? page : '1';

  const handleChangeStatus = (status: string) => {
    const { page, ...rest } = router.query;
    router.push({
      query: {
        ...rest,
        status,
      },
    });
  };

  const handleChangeFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const stringSearch = e.target.value.trim();
    const { search, page, ...rest } = router.query;
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
  const handleLogout = () => {
    document.cookie = 'token=;path=/';
    router.push('/auth/login');
  };

  useEffect(() => {
    if (!router.isReady) return;
    if (openModal) return;
    console.log('call api');
    ApiHandle.get('/api/todo', { status: status as string, search: search as string, page: page as string })
      .then((res) => {
        setTotalPages(res.data.totalPages);
        dispatch(fetchTodoList(res.data.listTodo));
      })
      .catch((e) => {
        router.push('/auth/login');
      });
  }, [router.isReady, status, search, page, checkUpdate]);

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
        <div className="flex items-center">
          <button onClick={handleOpenModal} className="p-3 bg-red-500 text-white ml-5">
            +
          </button>
        </div>

        <button className="ml-5 bg-red-500 p-3 text-white" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <>
        <table className="w-[1100px] min-h-[145px] text-left border border-solid border-[#333]">
          <thead>
            <tr>
              <th className="w-[50px]">#</th>
              <th className="w-[400px]">Name</th>
              <th className="w-[300px]">Score</th>
              <th className="w-[150px]">Status</th>
              <th className="w-[200px]">Due Date</th>
            </tr>
          </thead>

          {todoList?.length ? (
            <tbody>
              {todoList.length > 0
                ? todoList.map((each, index) => {
                    return <TodoComponent key={each.id} num={index} todo={each} checkUpdate={setCheckUpdate} />;
                  })
                : null}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td></td>
                <td>
                  <p>Không có kết quả</p>
                </td>
              </tr>
            </tbody>
          )}
        </table>

        <div className="mt-5">
          <p>Total Pages : {totalPages}</p>
          <p>Todos Per Page: {todosPerPage}</p>
        </div>
        <Panigation totalPages={Number(totalPages)} currentPage={+page} numPageShow={numPageShow} nearPage={nearPage} />
      </>

      {openModal ? (
        <ComponentAdd
          openModal={openModal}
          setOpenModal={setOpenModal}
          setFilter={setFilter}
          setCheckUpdate={setCheckUpdate}
        />
      ) : null}
    </main>
  );
}
