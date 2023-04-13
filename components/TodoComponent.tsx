import React, { useState, useRef, useEffect } from 'react';
import CreateIcon from '@mui/icons-material/Create';
import ClearIcon from '@mui/icons-material/Clear';
import { Todo } from '@/interfaces';
import { Status } from '@/constants';
import { useAppDispatch } from '@/hooks/common';
import { changeTodo, removeTodo } from '@/redux/todo.slice';
import Link from 'next/link';
export interface TodoProps {
  num: number;
  todo: Todo;
}

function TodoComponent({ num, todo }: TodoProps) {
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
  const [showUpdateScore, setShowUpdateScore] = useState<boolean>(false);
  const [textUpdate, setTextUpdate] = useState<string>(todo.name);
  const [textUpdateScore, setTextUpdateScore] = useState<string>(todo.score);
  const [open, setOpen] = useState<boolean>(false);
  const inputUpdateRef = useRef<HTMLInputElement>(null);
  const inputUpdateScoreRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const tdRef = useRef<HTMLTableCellElement>(null);

  // const [myObject, setMyObject] = useState<Todo>(todo);

  const dispatch = useAppDispatch();

  const getStatus = Object.keys(Status).filter((v) => isNaN(Number(v)));
  const handleOpen = (): void => setOpen(true);

  const handleClickIconUpdate = (): void => {
    setShowUpdate(true);
  };

  const handleClickIconRemove = (): void => {
    dispatch(removeTodo(todo.id));
  };

  const handleCheckUpdateScoreOrName = (e: React.KeyboardEvent<HTMLInputElement>, field: string): void => {
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
    dispatch(changeTodo(newTodo));
  };

  const handleClickIconUpdateScore = (): void => {
    setShowUpdateScore(true);
  };

  useEffect(() => {
    inputUpdateRef.current?.focus();
  }, [showUpdate]);

  useEffect(() => {
    const handleClickOut = (event: MouseEvent) => {
      if (divRef.current && divRef.current?.contains(event.target as Node)) {
        setOpen((preOpen) => !preOpen);
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

  return (
    <>
      <tr className="relative h-[20px]">
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
            <Link href={{ pathname: '/todo/[id]', query: { id: todo.id } }} className="cursor-pointer hover:opacity-80">
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
      </tr>

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
