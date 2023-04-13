import { Status } from '@/constants';
import { Dispatch, SetStateAction } from 'react';
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
  setFilter: Dispatch<SetStateAction<string>>;
}

export interface PanigationProps {
  totalPages: number;
  currentPage: number;
  // setCurrentPage: Dispatch<SetStateAction<number>>;
}
