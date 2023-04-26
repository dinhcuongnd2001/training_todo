import React, { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import CreateIcon from '@mui/icons-material/Create';
import ClearIcon from '@mui/icons-material/Clear';
import { Todo } from '@/interfaces';
import { Status } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/hooks/common';
import { changeTodo, removeTodo } from '@/redux/todo.slice';
import ApiHandle from '../service';
import Link from 'next/link';
import { formatDate } from '@/utils';
import AddAssignee from './AddAssignee';

export interface TodoProps {
  num: number;
  todo: Todo;
  checkUpdate: Dispatch<SetStateAction<boolean>>;
}

function TodoComponent({ num, todo, checkUpdate }: TodoProps) {
  const dispatch = useAppDispatch();
  const currUserId = useAppSelector((state) => state.users.currId);
  // state
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
  const [showUpdateScore, setShowUpdateScore] = useState<boolean>(false);
  const [showUpdateDate, setShowUpdateDate] = useState<boolean>(false);
  const [textUpdate, setTextUpdate] = useState<string>(todo.name);
  const [textUpdateScore, setTextUpdateScore] = useState<string>(todo.score);
  const [textUpdateDueDate, setTextUpdateDueDate] = useState<string>(todo.dueDate);
  const [open, setOpen] = useState<boolean>(false);
  const [openAddAssignee, setOpenAddAssignee] = useState<boolean>(false);

  // ref
  const inputUpdateRef = useRef<HTMLInputElement>(null);
  const inputUpdateScoreRef = useRef<HTMLInputElement>(null);
  const inputUpdateDateRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const tdRef = useRef<HTMLTableCellElement>(null);

  const getStatus = Object.keys(Status).filter((v) => isNaN(Number(v)));

  // handle action
  const handleOpen = (): void => setOpen(true);

  const handleClickIconUpdate = (): void => {
    setShowUpdate(true);
  };

  const handleClickIconRemove = (): void => {
    ApiHandle.delete(`api/todo/${todo.id}`)
      .then((res) => {
        checkUpdate((pre) => !pre);
      })
      .catch((e) => {
        console.log('e ::', e.response.data);
        alert(e.response.data);
      });
  };

  const handleCheckUpdateScoreOrName = (e: React.KeyboardEvent<HTMLInputElement>, field: string): void => {
    const cloneTodo: Todo = { ...todo };
    if (e.key == 'Enter') {
      const newTodo: Todo = { ...todo };
      if (field == 'name') {
        newTodo.name = textUpdate;
        setShowUpdate(false);
      }
      if (field == 'score') {
        newTodo.score = textUpdateScore;
        setShowUpdateScore(false);
      }
      dispatch(changeTodo(newTodo));
      ApiHandle.update(`api/todo/${todo.id}`, newTodo)
        .then((res) => {
          console.log('data after update ::', res);
        })
        .catch((e) => {
          dispatch(changeTodo(cloneTodo));
        });
    }
  };

  const handleOnBlur = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.name == 'name') {
      setShowUpdate(false);
      setTextUpdate(todo.name);
    } else if (e.target.name == 'score') {
      setShowUpdateScore(false);
      setTextUpdateScore(todo.score);
    }
  };

  const handleChangeStatus = (status: Status): void => {
    const newTodo: Todo = { ...todo };
    newTodo.status = status;
    setOpen(false);
    ApiHandle.update(`api/todo/${todo.id}`, newTodo)
      .then((res) => {
        checkUpdate((pre) => !pre);
        console.log('data after update ::', res);
      })
      .catch((e) => console.log('e in change status ::', e));
  };

  const handleClickIconUpdateScore = (): void => {
    setShowUpdateScore(true);
  };

  const handleClickIconUpdateDate = (): void => {
    setShowUpdateDate(true);
  };

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const todoClone: Todo = { ...todo };
    setTextUpdateDueDate(formatDate(e.target.value));
    setShowUpdateDate(false);
    const newTodo: Todo = { ...todo };
    newTodo.dueDate = formatDate(e.target.value);
    if (new Date(e.target.value).getTime() < new Date().getTime()) {
      alert(`The Due Date must be after ${formatDate(new Date().toString())}`);
    } else {
      // dispatch(changeTodo(newTodo));
      ApiHandle.update(`/api/todo/${todo.id}`, newTodo)
        .then((res) => {
          // console.log('res after call API ::', res.data);
          checkUpdate((pre) => !pre);
        })
        .catch((e) => {
          // dispatch(changeTodo(todoClone));
          console.log('err ::', e);
        });
    }
  };

  const handleLeaveTask = (userId: number, todoId: number) => {
    ApiHandle.delete(`/api/assignee/?userId=${userId}&todoId=${todoId}`)
      .then((res) => {
        alert('remove done');
        checkUpdate((pre) => !pre);
      })
      .catch((e) => {
        alert('remove false');
        console.log('e ::', e);
      });
  };

  // side effect

  useEffect(() => {
    inputUpdateRef.current?.focus();
  }, [showUpdate]);

  useEffect(() => {
    const handleClickOut = (event: MouseEvent) => {
      if (divRef.current && divRef.current?.contains(event.target as Node)) {
        setOpen(true);
      } else if (tdRef.current && !tdRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOut);
    return () => {
      document.removeEventListener('click', handleClickOut);
    };
  }, [tdRef, divRef]);

  useEffect(() => {
    inputUpdateScoreRef.current?.focus();
  }, [showUpdateScore]);

  useEffect(() => {
    inputUpdateDateRef.current?.focus();
  }, [showUpdateDate]);

  return (
    <>
      <tr className="relative h-[20px] ">
        <td>{num}</td>
        {showUpdate ? (
          <td className="w-[200px] mb-1 p-2 flex justify-start">
            <div className="w-4 h-4 bg-red inline-block mr-10"></div>
            <input
              ref={inputUpdateRef}
              value={textUpdate}
              onChange={(e) => {
                setTextUpdate(e.target.value);
              }}
              type="text"
              name="name"
              onKeyDown={(e) => handleCheckUpdateScoreOrName(e, 'name')}
              onBlur={(e) => handleOnBlur(e)}
            />
          </td>
        ) : (
          <td className="group mb-1 p-2 flex justify-start items-center h-[50px]">
            <div
              ref={divRef}
              onClick={() => handleOpen()}
              className="w-4 h-4 bg-red-500 inline-block mr-10 cursor-pointer"
            ></div>
            <Link
              href={{ pathname: '/todo/[slug]', query: { slug: todo.name } }}
              className="cursor-pointer hover:opacity-80"
            >
              {todo.name}
            </Link>
            <span className="ml-5 hidden group-hover:inline-block">
              <span onClick={handleClickIconUpdate}>
                <CreateIcon className="w-2 h-2 cursor-pointer hover:opacity-70 inline-block" />
              </span>
              <span onClick={handleClickIconRemove}>
                <ClearIcon className="w-2 h-2 cursor-pointer hover:opacity-70 inline-block" />
              </span>
            </span>
          </td>
        )}

        {/* score */}
        {showUpdateScore ? (
          <td className="">
            <input
              className=""
              ref={inputUpdateScoreRef}
              value={textUpdateScore}
              onChange={(e) => {
                setTextUpdateScore(e.target.value);
              }}
              type="text"
              name="score"
              onKeyDown={(e) => handleCheckUpdateScoreOrName(e, 'score')}
              onBlur={(e) => handleOnBlur(e)}
            />
          </td>
        ) : (
          <td className="group h-[50px]">
            <div className="flex items-center">
              <span>{todo.score}</span>
              <span className="ml-2 hidden group-hover:inline-block" onClick={handleClickIconUpdateScore}>
                <CreateIcon className="cursor-pointer hover:opacity-70 inline-block" />
              </span>
            </div>
          </td>
        )}

        {/* status */}

        <td className="">
          <span>{todo.status}</span>
        </td>

        {/* due Date */}
        {showUpdateDate ? (
          <td className="">
            <input
              className=""
              ref={inputUpdateDateRef}
              value={textUpdateDueDate}
              onChange={handleChangeDate}
              type="date"
              name="date"
              onBlur={(e) => setShowUpdateDate(false)}
            />
          </td>
        ) : (
          <td className="group h-[50px]">
            <div className="flex items-center">
              <span>{todo.dueDate}</span>
              <span className="ml-2 hidden group-hover:inline-block" onClick={handleClickIconUpdateDate}>
                <CreateIcon className="cursor-pointer hover:opacity-70 inline-block" />
              </span>
            </div>
          </td>
        )}

        {/* Assignee */}
        {todo.role === 'AUTHOR' ? (
          <td className="group h-[50px]">
            <button
              onClick={() => {
                setOpenAddAssignee(true);
              }}
              className="p-2 bg-red-600 text-white hover:opacity-80"
            >
              Change Assignee
            </button>
          </td>
        ) : (
          <td>
            <button
              onClick={() => {
                handleLeaveTask(Number(currUserId), Number(todo.id));
              }}
              className="p-2 bg-red-600 text-white hover:opacity-80"
            >
              Leave Task
            </button>
          </td>
        )}
      </tr>
      {openAddAssignee ? (
        <AddAssignee todo={todo} openAddAssignee={openAddAssignee} setOpenAddAssignee={setOpenAddAssignee} />
      ) : null}
      <tr className="relative">
        {open ? (
          <td ref={tdRef} className="w-[200px] bg-[#333]/90 absolute top-[-15px]  z-10 text-white">
            {getStatus.map((x, index) => (
              <div
                key={index}
                onClick={() => handleChangeStatus(x as Status)}
                className="cursor-pointer p-1 pb-2 border-b-2 border-solid hover:opacity-80"
              >
                {x}
              </div>
            ))}
          </td>
        ) : null}
      </tr>
    </>
  );
}

export default TodoComponent;
