import { useAppSelector } from '@/hooks/common';
import Modal from '@mui/material/Modal';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import ApiHandle from '../service';
import { Todo, Assignee } from '@/interfaces';
export interface AddAssigneeProps {
  todo: Todo;
  openAddAssignee: boolean;
  setOpenAddAssignee: Dispatch<SetStateAction<boolean>>;
}

interface ListAssignee {
  name: string;
  email: string;
  id: number;
}
interface ListUser {
  name: string;
  email: string;
  id: number;
}
function AddAssignee({ todo, openAddAssignee, setOpenAddAssignee }: AddAssigneeProps) {
  const listUser = useAppSelector((state) => state.users.users);
  const [assignees, setAssignees] = useState<ListAssignee[]>();
  const [userNotInTodo, setUserNotInTodo] = useState<ListUser[]>();
  const [assignee, setAssignee] = useState<Assignee>({ todoId: -1, userId: -1 });
  const [checkRender, setCheckRender] = useState<Boolean>(false);

  useEffect(
    () => {
      ApiHandle.get(`/api/user/getAssignees/?todoId=${todo.id}`)
        .then((res) => {
          setAssignees(res.data);
        })
        .catch((e) => console.log('e ::', e));
    },
    // [checkRender]
    [checkRender, todo.id]
  );

  useEffect(
    () => {
      ApiHandle.get(`/api/user/getUser/?todoId=${todo.id}&authorId=${todo.authorId}`)
        .then((res) => {
          setUserNotInTodo(res.data);
        })
        .catch((e) => console.log('e ::', e));
    },
    // [assignees]
    [assignees, todo.id, todo.authorId]
  );

  const handleAddAssignee = () => {
    if (assignee.todoId < 0 && assignee.userId < 0) {
      alert('Assignee Invalid');
    } else {
      ApiHandle.create(`/api/assignee`, assignee)
        .then((res) => {
          setCheckRender(!checkRender);
          setAssignee({ todoId: -1, userId: -1 });
        })
        .catch((e) => console.log('e ::', e));
    }
  };

  const handleRemove = (userId: number, todoId: number) => {
    ApiHandle.delete(`/api/assignee/?userId=${userId}&todoId=${todoId}`)
      .then((res) => {
        setCheckRender(!checkRender);
      })
      .catch((e) => {
        console.log('e ::', e);
      });
  };
  return (
    <Modal
      open={openAddAssignee}
      onClose={() => {
        setOpenAddAssignee(false);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="relative p-10 overflow-x-auto shadow-md -lg flex justify-center flex-col items-center bg-gray-900 w-[40%] min-h-[600px] m-auto mt-20">
        <h1 className="mb-5 mt-20">Todo: {todo.name}</h1>
        <h2 className="mb-5">Table Assignee</h2>
        <table className="text-sm text-left text-gray-500 dark:text-gray-400 w-[400px] ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                DELETE
              </th>
            </tr>
          </thead>

          <tbody>
            {assignees?.map((x, index) => (
              <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {x.name}
                </th>
                <td className="px-6 py-4">{x.email}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleRemove(x.id, Number(todo.id))}>DELETE</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="mt-10 min-h-[30vh] w-[75%] relative"
          action=""
        >
          <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Select an option
          </label>
          <select
            onChange={(e) => {
              setAssignee({ todoId: Number(todo.id), userId: Number(e.target.value) });
            }}
            value={assignee.userId}
            id="countries"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option key="12323" value="">
              Select An Assignee
            </option>
            {userNotInTodo
              ? userNotInTodo.map((x, index) => (
                  <option key={index} value={x.id}>
                    {x.name} - {x.email}
                  </option>
                ))
              : null}
          </select>
          <button onClick={handleAddAssignee} className="absolute bottom-0 right-0">
            Save
          </button>
        </form>
      </div>
    </Modal>
  );
}

export default AddAssignee;
