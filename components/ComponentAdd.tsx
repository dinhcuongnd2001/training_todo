import { useState } from 'react';
import { Status } from '@/constants';
import { Todo } from '@/interfaces';
import { useAppSelector } from '@/hooks/common';
import { AddTodoProps } from '@/interfaces';
import Modal from '@mui/material/Modal';
import { useRouter } from 'next/router';
import ApiHandle from '../service';
import { createDueDate } from '@/utils';
import { TodoStatus } from '@prisma/client';

function ComponentAdd({ openModal, setOpenModal, setFilter, setCheckUpdate }: AddTodoProps) {
  const router = useRouter();
  const [todo, setTodo] = useState<Todo>({
    name: '',
    score: '',
    status: TodoStatus.CLOSE,
    desc: '',
    dueDate: createDueDate(),
    authorId: 0,
  });
  const status = Object.keys(Status).filter((v) => isNaN(Number(v)));
  // const getTodoList = useAppSelector((state) => state.todolist.list);
  const handleSubmit = (): void => {
    ApiHandle.create('api/todo', todo)
      .then((res) => {
        alert('Thêm thành công');
        setCheckUpdate((pre) => {
          return !pre;
        });
      })
      .catch((e) => {
        alert(e.response.data);
      });
    setTodo({ name: '', score: '', status: TodoStatus.CLOSE, desc: '', dueDate: createDueDate(), authorId: 0 });
    setOpenModal(false);
    setFilter('');
    router.push('');
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
            <button className="p-2 bg-red-400 rounded text-white">Save</button>
          </div>
        </form>
      </>
    </Modal>
  );
}

export default ComponentAdd;
