import { Status } from '@/constants'
export interface Todo {
  id: string
  name: string
  score: string
  desc: string
  status: Status | string
}
