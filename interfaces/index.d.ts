import { Status } from '@/constants';
import { SetStateAction } from 'react';
export interface Todo {
  id: string;
  name: string;
  score: string;
  desc: string;
  status: Status | string;
}

export interface AddTodoProps {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}
