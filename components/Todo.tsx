import { useState, useRef } from 'react';
import { debounceFunction } from '../utils/debounceFunction';
import { debounce } from 'lodash';
import CreateIcon from '@mui/icons-material/Create';
import ClearIcon from '@mui/icons-material/Clear';
import { Status, Todo } from '../pages/index';

export interface TodoProps {
  index: number;
  name: string;
  score: string;
  status: string;
  todoList: Todo[];
  setTodoList: React.Dispatch<React.SetStateAction<any>>;
}

function Todo({ index, name, score, status, todoList, setTodoList }: TodoProps) {
  const debounceFn = debounce((location) => {
    if (location == 'out') {
      setHidden(true);
    } else setHidden(false);
  }, 200);

  const [hidden, setHidden] = useState(true);
  const [showUpdate, setShowUpdate] = useState(false);
  const [textUpdate, setTextUpdate] = useState(name);
  const [open, setOpen] = useState(false);
  const inputUpdate = useRef<HTMLInputElement>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClickIconUpdate = () => {
    setShowUpdate(true);
    console.log(inputUpdate.current);
    inputUpdate.current?.focus();
  };

  const handleClickIconRemove = () => {
    const newTodoList = todoList.filter((each, ind) => ind != index);
    setTodoList([...newTodoList]);
  };

  const handleUpdate = (index: number) => {
    const newTodoList = todoList;
    newTodoList[index].name = textUpdate;
    setTodoList([...newTodoList]);
    setShowUpdate(false);
  };
  return (
    <>
      <tr className="relative">
        <th>{index}</th>
        {showUpdate ? (
          <th className="w-[500px] mb-1 p-2">
            <input
              ref={inputUpdate}
              value={textUpdate}
              onChange={(e) => {
                setTextUpdate(e.target.value);
              }}
              className="border-none "
              type="text"
            />
            <button
              onClick={() => handleUpdate(index)}
              className="ml-2 p-2 border-1 border-[#333] bg-red-600 text-white"
            >
              Update
            </button>
          </th>
        ) : (
          <th
            onMouseMove={() => {
              debounceFn('');
            }}
            onMouseOut={() => {
              debounceFn('out');
            }}
            className="w-[300px] mb-1 p-2 flex justify-start items-center "
          >
            <div
              onClick={() => handleOpen()}
              className="w-4 h-4 bg-red-500 inline-block mr-10 cursor-pointer "
            ></div>

            <span className="cursor-pointer hover:opacity-80">{name}</span>
            {hidden ? null : (
              <span className="">
                <span onClick={handleClickIconUpdate}>
                  <CreateIcon className="w-3 h-3 cursor-pointer hover:opacity-70" />
                </span>
                <span onClick={handleClickIconRemove}>
                  <ClearIcon className="w-3 h-3 cursor-pointer hover:opacity-70" />
                </span>
              </span>
            )}
          </th>
        )}
        <th>{score}</th>
        <th>{status}</th>
      </tr>
      {open ? (
        <div className="">
          <div>
            <div>{Status.CLOSE}</div>
            <div>{Status.TODO}</div>
            <div>{Status.BACKLOG}</div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Todo;
