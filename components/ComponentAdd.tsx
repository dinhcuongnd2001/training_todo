import { useState } from 'react';
import { Status } from '@/constants';
import { Todo } from '@/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '@/hooks/common';
import { addTodo } from '@/redux/todo.slice';
import { AddTodoProps } from '@/interfaces';
import Modal from '@mui/material/Modal';
import { useRouter } from 'next/router';
import axios from 'axios';

function ComponentAdd({ openModal, setOpenModal, setFilter }: AddTodoProps) {
  const router = useRouter();
  const [todo, setTodo] = useState<Todo>({
    id: uuidv4(),
    name: '',
    score: '',
    status: Status.CLOSE,
    desc: '',
    dueDate: '',
  });
  const status = Object.keys(Status).filter((v) => isNaN(Number(v)));
  const dispatch = useAppDispatch();

  const getTodoList = useAppSelector((state) => state.todolist.list);
  const handleSubmit = (): void => {
    const currName = getTodoList.find(
      (x) => x.name.toLocaleLowerCase().trim() === todo.name.toLocaleLowerCase().trim()
    );
    if (currName) {
      alert('Ten Bi Trung');
    } else {
      axios
        .post('/api/todo', todo)
        .then((res) => {})
        .catch((e) => console.log(e));
      setTodo({ id: uuidv4(), name: '', score: '', status: Status.CLOSE, desc: '', dueDate: '' });
      setOpenModal(false);
      setFilter('');
      router.push('');
    }
  };
  const handleClose = (): void => {
    setOpenModal(false);
  };
  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="flex justify-center items-center"
    >
      <>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className=" w-[35%] bg-white flex flex-col justify-center text-black items-center p-2  pl-[50px] border border-solid border-[#333] mt-2"
        >
          <div className="mb-5">
            <input
              className="p-2 border rounded"
              value={todo.name}
              name="name"
              type="text"
              placeholder="Name"
              onChange={(e) => {
                setTodo({ ...todo, [e.target.name]: e.target.value });
              }}
            />
          </div>

          <div className="mb-5">
            <input
              className="p-2 border rounded"
              name="score"
              type="text"
              placeholder="Score"
              value={todo.score}
              onChange={(e) => {
                setTodo({ ...todo, [e.target.name]: e.target.value });
              }}
            />
          </div>

          <div className="mb-5">
            <input
              className="p-2 border rounded"
              name="dueDate"
              type="date"
              placeholder=""
              value={todo.dueDate}
              onChange={(e) => {
                setTodo({ ...todo, [e.target.name]: e.target.value });
              }}
            />
          </div>

          <div className="mb-10">
            <label className="mr-3">Status</label>
            <select
              name="status"
              className="cursor-pointer"
              value={todo.status}
              onChange={(e) => {
                setTodo({ ...todo, [e.target.name]: e.target.value });
              }}
            >
              {status.map((x, index) => (
                <option className="p-2" key={index}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end w-full">
            <button className="p-2 bg-red-600 rounded text-white">Save</button>
          </div>
        </form>
      </>
    </Modal>
  );
}

export default ComponentAdd;
