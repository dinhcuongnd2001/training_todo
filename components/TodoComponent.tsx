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
  const [showUpdate, setShowUpdate] = useState(false);
  const [showUpdateScore, setShowUpdateScore] = useState(false);
  const [textUpdate, setTextUpdate] = useState(name);
  const [textUpdateScore, setTextUpdateScore] = useState(score);
  const [open, setOpen] = useState(false);
  const inputUpdateRef = useRef<HTMLInputElement>(null);
  const inputUpdateScoreRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const tdRef = useRef<HTMLTableCellElement>(null);

  const handleOpen = () => setOpen(true);

  const handleClickIconUpdate = () => {
    setShowUpdate(true);
  };

  const handleClickIconRemove = () => {
    const newTodoList = todoList.filter((each) => each.id != index);
    setTodoList([...newTodoList]);
  };

  const handleCheckUpdate = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      const newTodoList = todoList.map((x) => {
        if (x.id != index) return x;
        else return { ...x, name: textUpdate };
      });
      setTodoList([...newTodoList]);
      setShowUpdate(false);
    }
  };

  const handleCheckUpdateScore = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      const newTodoList = todoList.map((x) => {
        if (x.id != index) return x;
        else return { ...x, score: textUpdateScore };
      });
      setTodoList([...newTodoList]);
      setShowUpdateScore(false);
    }
  };

  const handleOnBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowUpdate(false);
    setTextUpdate(name);
  };

  const handleOnBlurScore = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowUpdateScore(false);
    setTextUpdateScore(score);
  };

  const handleChangeStatus = (status: Status) => {
    // const newTodoList = todoList;
    // newTodoList[index].status = status;
    const newTodoList = todoList.map((x) => {
      if (x.id != index) return x;
      else return { ...x, status: status };
    });
    setTodoList([...newTodoList]);
    setOpen(false);
  };

  const handleClickIconUpdateScore = () => {
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
