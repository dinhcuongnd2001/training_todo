import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchUser: (state, action) => {
      console.log('action.payload ::', action.payload);
      state.users = action.payload;
    },
  },
});

export const { fetchUser } = usersSlice.actions;
export default usersSlice.reducer;
