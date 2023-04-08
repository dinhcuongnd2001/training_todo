import React, { useState, useRef, useEffect } from 'react';
import { debounceFunction } from '../utils/debounceFunction';
import { debounce } from 'lodash';
import CreateIcon from '@mui/icons-material/Create';
import ClearIcon from '@mui/icons-material/Clear';
import { Todo } from '@/interfaces';
import { Status } from '@/constants';

export interface TodoProps {
  index: number;
  name: string;
  score: string;
  status: string;
  todoList: Todo[];
  setTodoList: React.Dispatch<React.SetStateAction<Todo[]>>;
}

function TodoComponent({ index, name, score, status, todoList, setTodoList }: TodoProps) {
  const [hidden, setHidden] = useState(true);
  const [showUpdate, setShowUpdate] = useState(false);
  const [textUpdate, setTextUpdate] = useState(name);
  const [open, setOpen] = useState(false);
  const inputUpdateRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const tdRef = useRef<HTMLTableCellElement>(null);

  console.log('re-render');
  const handleOpen = () => setOpen(true);

  const debounceFn = debounce((location) => {
    if (location == 'out') {
      setHidden(true);
    } else setHidden(false);
  }, 200);

  const handleClickIconUpdate = () => {
    setShowUpdate(true);
    inputUpdateRef.current?.focus();
  };

  const handleClickIconRemove = () => {
    const newTodoList = todoList.filter((each, ind) => ind != index);
    setTodoList([...newTodoList]);
  };

  const handleCheckUpdate = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      const newTodoList = todoList;
      newTodoList[index].name = textUpdate;
      setTodoList([...newTodoList]);
      setShowUpdate(false);
    }
  };

  const handleOnBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowUpdate(false);
    setTextUpdate(name);
  };

  const handleChangeStatus = (status: Status) => {
    const newTodoList = todoList;
    newTodoList[index].status = status;
    setTodoList([...newTodoList]);
    setOpen(false);
  };

  useEffect(() => {
    inputUpdateRef.current?.focus();
  }, [showUpdate]);

  useEffect(() => {
    const handleClickOut = (event: MouseEvent) => {
      if (divRef.current && divRef.current?.contains(event.target as Node)) {
        setOpen(!open);
      } else if (tdRef.current && !tdRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOut);
    return () => {
      document.removeEventListener('click', handleClickOut);
    };
  }, [tdRef, divRef]);

  return (
    <>
      <tr className="relative">
        <td>{index}</td>
        {showUpdate ? (
          <td className="w-[300px] mb-1 p-2 flex justify-start">
            <div
              onClick={() => handleOpen()}
              className="w-4 h-4 inline-block mr-10 cursor-pointer"
            ></div>
            <input
              ref={inputUpdateRef}
              value={textUpdate}
              onChange={(e) => {
                setTextUpdate(e.target.value);
              }}
              type="text"
              onKeyDown={(e) => handleCheckUpdate(e)}
              onBlur={(e) => handleOnBlur(e)}
            />
          </td>
        ) : (
          <td
            onMouseMove={() => {
              debounceFn('');
            }}
            onMouseOut={() => {
              debounceFn('out');
            }}
            className="w-[300px] mb-1 p-2 flex justify-start items-center relative"
          >
            <div
              ref={divRef}
              onClick={() => handleOpen()}
              className="w-4 h-4 bg-red-500 inline-block mr-10 cursor-pointer"
            ></div>

            <span className="cursor-pointer hover:opacity-80">{name}</span>
            {hidden ? null : (
              <span className="ml-5">
                <span onClick={handleClickIconUpdate}>
                  <CreateIcon className="w-2 h-2 cursor-pointer hover:opacity-70 inline-block" />
                </span>
                <span onClick={handleClickIconRemove}>
                  <ClearIcon className="w-2 h-2 cursor-pointer hover:opacity-70 inline-block" />
                </span>
              </span>
            )}
          </td>
        )}
        <td>{score}</td>
        <td className="min-w-[100px]">{status}</td>
      </tr>
      <tr className="relative">
        {open ? (
          <td
            ref={tdRef}
            className="w-[200px] h-[100px] bg-[#333]/90 absolute top-[-15px] z-10 text-white"
          >
            <div
              onClick={() => handleChangeStatus(Status.CLOSE)}
              className="cursor-pointer mb-2 border-b-2 border-solid hover:opacity-80"
            >
              {Status.CLOSE}
            </div>
            <div
              onClick={() => handleChangeStatus(Status.TODO)}
              className="cursor-pointer mb-2 border-b-2 border-solid hover:opacity-80"
            >
              {Status.TODO}
            </div>
            <div
              onClick={() => handleChangeStatus(Status.BACKLOG)}
              className="cursor-pointer mb-2 border-b-2 border-solid hover:opacity-80"
            >
              {Status.BACKLOG}
            </div>
          </td>
        ) : null}
      </tr>
    </>
  );
}

export default TodoComponent;
