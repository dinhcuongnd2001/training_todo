import React, { useState, useRef, useEffect } from 'react';
import CreateIcon from '@mui/icons-material/Create';
import ClearIcon from '@mui/icons-material/Clear';
import { Todo } from '@/interfaces';
import { Status } from '@/constants';

export interface TodoProps {
  num: number;
  index: string;
  name: string;
  score: string;
  status: string;
  todoList: Todo[];
  setTodoList: React.Dispatch<React.SetStateAction<Todo[]>>;
}

function TodoComponent({ num, index, name, score, status, todoList, setTodoList }: TodoProps) {
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
  const [showUpdateScore, setShowUpdateScore] = useState<boolean>(false);
  const [textUpdate, setTextUpdate] = useState<string>(name);
  const [textUpdateScore, setTextUpdateScore] = useState<string>(score);
  const [open, setOpen] = useState<boolean>(false);
  const inputUpdateRef = useRef<HTMLInputElement>(null);
  const inputUpdateScoreRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const tdRef = useRef<HTMLTableCellElement>(null);

  const getStatus = Object.keys(Status).filter((v) => isNaN(Number(v)));
  const handleOpen = (): void => setOpen(true);

  const handleClickIconUpdate = (): void => {
    setShowUpdate(true);
  };

  const handleClickIconRemove = (): void => {
    const newTodoList = todoList.filter((each) => each.id != index);
    setTodoList([...newTodoList]);
  };

  const handleCheckUpdate = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key == 'Enter') {
      const newTodoList = todoList.map((x) => {
        if (x.id != index) return x;
        else return { ...x, name: textUpdate };
      });
      setTodoList([...newTodoList]);
      setShowUpdate(false);
    }
  };

  const handleCheckUpdateScore = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key == 'Enter') {
      const newTodoList = todoList.map((x) => {
        if (x.id != index) return x;
        else return { ...x, score: textUpdateScore };
      });
      setTodoList([...newTodoList]);
      setShowUpdateScore(false);
    }
  };

  const handleOnBlur = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setShowUpdate(false);
    setTextUpdate(name);
  };

  const handleOnBlurScore = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setShowUpdateScore(false);
    setTextUpdateScore(score);
  };

  const handleChangeStatus = (status: Status): void => {
    const newTodoList = todoList.map((x) => {
      if (x.id != index) return x;
      else return { ...x, status: status };
    });
    setTodoList([...newTodoList]);
    setOpen(false);
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
              onKeyDown={(e) => handleCheckUpdate(e)}
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
            <span className="cursor-pointer hover:opacity-80">{name}</span>
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
              onKeyDown={(e) => handleCheckUpdateScore(e)}
              onBlur={(e) => handleOnBlurScore(e)}
            />
          </td>
        ) : (
          <td className="group h-[50px]">
            <div className="flex items-center">
              <span>{score}</span>
              <span
                className="ml-2 hidden group-hover:inline-block"
                onClick={handleClickIconUpdateScore}
              >
                <CreateIcon className="cursor-pointer hover:opacity-70 inline-block" />
              </span>
            </div>
          </td>
        )}

        {/* status */}

        <td className="">
          <span>{status}</span>
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
