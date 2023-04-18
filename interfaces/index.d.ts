import { Status } from '@/constants';
import { Dispatch, SetStateAction } from 'react';

export interface Todo {
  id: string;
  name: string;
  score: string;
  desc: string;
  status: Status | string;
  dueDate: string;
}

export interface AddTodoProps {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  setFilter: Dispatch<SetStateAction<string>>;
}

export interface PanigationProps {
  totalPages: number;
  currentPage: number;
  numPageShow: number;
  nearPage: number;
}

export interface ParamsForGetApi {
  status?: string;
  search?: string;
  page: string;
}

export interface ApiResponse {
  totalPages?: number;
  listTodo: Todo[];
}
