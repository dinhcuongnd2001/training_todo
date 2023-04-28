import { useState, useEffect, ChangeEvent } from 'react';
import ComponentAdd from '../components/ComponentAdd';
import TodoComponent from '@/components/TodoComponent';
import { Status } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/hooks/common';
import { fetchTodoList } from '@/redux/todo.slice';
import { useRouter } from 'next/router';
import { fetchCurrId, fetchUser } from '@/redux/user.slice';
import { debounce } from 'lodash';
import ApiHandle from '../service';
import { classNames } from '@/utils';
// import Pagination from '@/components/Pagination';
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid';

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
  let { status, search, page, order } = router.query;
  const statusFilter = status ? String(status) : 'ALL';
  const searchFilter = search ? String(search) : '';
  const pageFilter = page ? String(page) : '1';
  const orderFilter = order ? String(order) : 'asc';

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

  const changeSort = (typeOrder: string) => {
    const { order, page, ...rest } = router.query;
    router.push({
      query: {
        order: typeOrder,
        ...rest,
      },
    });
  };

  const handlePrevious = () => {
    const params = router.query;
    router.push({ query: { ...params, page: +pageFilter - 1 } });
  };

  const handleNext = () => {
    const params = router.query;
    router.push({ query: { ...params, page: +pageFilter + 1 } });
  };

  const handleSelectPage = (x: number) => {
    const params = router.query;
    router.push({ query: { ...params, page: x } });
  };

  useEffect(() => {
    if (!router.isReady) return;
    // if (openModal) return;
    console.log('call api');
    ApiHandle.get('/api/todo', { status: statusFilter, search: searchFilter, page: pageFilter, order: orderFilter })
      .then((res) => {
        setTotalPages(res.data.totalPages);
        dispatch(fetchTodoList(res.data.listTodo));
        dispatch(fetchCurrId(res.data.currId));
      })
      .catch((e) => {
        router.push('/auth/login');
      });
  }, [router.isReady, statusFilter, orderFilter, searchFilter, pageFilter, checkUpdate]);

  const getStatus = Object.keys(Status).filter((v) => isNaN(Number(v)));
  const listStatus = ['ALL', ...getStatus];

  return (
    <main className="w-full h-[100vh] bg-white text-black p-8">
      <div className="mb-4 flex items-center flex-wrap">
        <div className="w-[1300px] mb-2 flex justify-between">
          <div>
            {listStatus.map((x, index) => (
              <button
                onClick={() => handleChangeStatus(x)}
                key={index}
                className={classNames(
                  'p-2 mr-4 text-sm text-gray-700 uppercase rounded hover:cursor-pointer hover:opacity-80 min-w-[80px]',
                  status === x ? 'bg-red-400' : 'bg-gray-50 dark:bg-gray-700 dark:text-gray-400'
                )}
              >
                {x}
              </button>
            ))}
            <button
              onClick={() => changeSort('desc')}
              className="p-2 mr-4 text-sm text-gray-700 uppercase rounded hover:cursor-pointer hover:opacity-80 min-w-[80px] bg-red-400"
            >
              desc
            </button>

            <button
              onClick={() => changeSort('asc')}
              className="p-2 mr-4 text-sm text-gray-700 uppercase rounded hover:cursor-pointer hover:opacity-80 min-w-[80px] bg-red-400"
            >
              asc
            </button>
            {/* add */}
            <button
              onClick={handleOpenModal}
              className="p-2 text-sm text-gray-700 uppercase rounded hover:cursor-pointer hover:opacity-80 min-w-[80px] bg-red-400"
            >
              Add Todo
            </button>
          </div>

          {/* logout */}
          <div>
            <button
              className="p-2 text-sm uppercase rounded hover:cursor-pointer hover:opacity-80 min-w-[80px] bg-red-400 text-gray-800"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        {/* search */}
        <div className="w-[370px] mb-2">
          <input
            className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search"
            type="text"
            value={filter}
            onChange={handleChangeFilter}
          />
        </div>
      </div>

      <>
        <table className="w-[1300px] text-left border border-solid border-[#333]">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 h-[50px]">
            <tr>
              <th className="w-[50px]">#</th>
              <th className="w-[400px]">Name</th>
              <th className="w-[300px]">Score</th>
              <th className="w-[150px]">Status</th>
              <th className="w-[200px]">Due Date</th>
              <th className="w-[200px]">Action</th>
            </tr>
          </thead>

          {todoList?.length ? (
            <tbody className="h-[120px]">
              {todoList.length > 0
                ? todoList.map((each, index) => {
                    return <TodoComponent key={each.id} num={index} todo={each} checkUpdate={setCheckUpdate} />;
                  })
                : null}
            </tbody>
          ) : (
            <tbody className="h-[120px]">
              <tr>
                <td></td>
                <td>
                  <p>No Result</p>
                </td>
              </tr>
            </tbody>
          )}
        </table>

        {/* Panigation */}

        <div className="mt-5">
          <p className=" text-sm font-medium text-gray-500">Total Pages : {totalPages}</p>
          <p className=" text-sm font-medium text-gray-500">Todos Per Page: {todosPerPage}</p>
        </div>
        {/* <Pagination
          totalPages={Number(totalPages)}
          (+pageFilter)={+pageFilter}
          numPageShow={numPageShow}
          nearPage={nearPage}
        /> */}
        <nav className="w-[1300px] mt-5 flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
          <div className="-mt-px flex w-0 flex-1">
            <button
              disabled={+pageFilter == 1 || totalPages == 0 ? true : false}
              onClick={handlePrevious}
              className="inline-flex items-center cursor-pointer border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              <ArrowLongLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
              Previous
            </button>
          </div>

          <div className="hidden md:-mt-px md:flex">
            {Number(totalPages) <= 5 ? (
              Array.from({ length: Number(totalPages) }, (_, i) => i + 1).map((x) => (
                <button
                  key={x}
                  onClick={() => handleSelectPage(x)}
                  className={
                    +pageFilter == x
                      ? 'items-center border-t-2 border-gray-300 px-4 pt-4 text-sm font-medium text-gray-500'
                      : 'cursor-pointer inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500'
                  }
                  aria-current="page"
                >
                  {x}
                </button>
              ))
            ) : (
              <div></div>
            )}
          </div>

          <div className="-mt-px flex w-0 flex-1 justify-end">
            <button
              disabled={+pageFilter == totalPages || totalPages == 0 ? true : false}
              onClick={handleNext}
              className="cursor-pointer inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              Next
              <ArrowLongRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
            </button>
          </div>
        </nav>
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
