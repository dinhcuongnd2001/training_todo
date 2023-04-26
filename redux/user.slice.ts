import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  currId: '',
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchUser: (state, action) => {
      state.users = action.payload;
    },
    fetchCurrId: (state, action) => {
      state.currId = action.payload;
    },
  },
});

export const { fetchUser, fetchCurrId } = usersSlice.actions;
export default usersSlice.reducer;
