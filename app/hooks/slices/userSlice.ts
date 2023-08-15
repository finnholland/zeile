import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { User } from '@/types';
import * as fb from '@/firebase'

export const userInitialState: User = {
  uid: '',
  name: '',
  colour: ''
};

export const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.uid = action.payload.uid
      state.name = action.payload.name
      state.colour = action.payload.colour
    }
  },
});

export const { setUser } = userSlice.actions;


export default userSlice.reducer;

export const selectUser = (state: RootState) => state.user;
