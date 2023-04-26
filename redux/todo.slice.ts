import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Todo } from '@/interfaces';
interface TodoListState {
  list: Todo[];
}

const initialState: TodoListState = {
  list: [],
};

export const todoListSlice = createSlice({
  name: 'todoList',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.list.push(action.payload);
    },

    removeTodo: (state, action: PayloadAction<string>) => {
      // const filterList = state.list.filter((x) => x.id != action.payload);
      // state.list = filterList;
    },

    changeTodo: (state, action: PayloadAction<Todo>) => {
      const index = state.list.findIndex((x) => x.id == action.payload.id);
      state.list[index] = action.payload;
    },

    fetchTodoList: (state, action: PayloadAction<Todo[]>) => {
      state.list = action.payload;
    },
    resetTodoList: (state, action) => {},
  },
});

export const { addTodo, removeTodo, changeTodo, fetchTodoList, resetTodoList } = todoListSlice.actions;

export default todoListSlice.reducer;
