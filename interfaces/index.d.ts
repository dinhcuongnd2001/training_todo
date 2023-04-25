import { Status } from '@/constants';
import { TodoStatus } from '@prisma/client';
import { Dispatch, SetStateAction } from 'react';
import { NextApiRequest } from 'next/types';
import Error from 'next/error';
export interface Todo {
  id?: number;
  name: string;
  score: string;
  desc: string;
  status: TodoStatus;
  dueDate: string;
  authorId: number;
}

export interface AddTodoProps {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  setFilter: Dispatch<SetStateAction<string>>;
  setCheckUpdate: Dispatch<SetStateAction<boolean>>;
}

export interface Assignee {
  userId: number;
  todoId: number;
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
  order: string;
  slug?: string;
  id?: string;
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

export interface AuthenticatedRequest extends NextApiRequest {
  query: ParamsForGetApi;
  cookies: {
    token?: string;
  };
  authorId: number;
  role: string;
}

export interface CreateTodoRequest extends AuthenticatedRequest {
  body: Omit<Todo, 'authorId'>;
}

export interface DNC_Error extends Error {
  message: string;
  statusCode: number;
}
