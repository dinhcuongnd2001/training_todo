import { Status } from '@/constants';
import { TodoStatus } from '@prisma/client';
import { Dispatch, SetStateAction } from 'react';

export interface Todo {
  id?: number;
  name: string;
  score: string;
  desc: string;
  status: TodoStatus;
}

export interface AddTodoProps {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  setFilter: Dispatch<SetStateAction<string>>;
  setCheckAdd: Dispatch<SetStateAction<boolean>>;
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

export interface RegisterDataType {
  name: string;
  email: string;
  password: string;
}

export interface LoginDataType {
  email: string;
  password: string;
}
