import { Status } from '@/constants';
export interface Todo {
  id: string;
  name: string;
  score: string;
  status: Status | string;
}
