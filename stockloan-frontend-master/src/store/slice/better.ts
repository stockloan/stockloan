import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IBetterState {
  isEnter: boolean;
  isOpen: boolean;
}

const initialState: IBetterState = {
  isEnter: false,
  isOpen: false,
};
const betterSlice = createSlice({
  name: 'better',
  initialState,
  reducers: {
    setIsEnterBetter: (state, action: PayloadAction<boolean>) => {
      state.isEnter = action.payload;
      // const isShowGitpleChat = state.isEnter ? 'hide' : 'show';
      // if (window.Gitple) {
      //   window.Gitple(isShowGitpleChat);
      // }
    },
    setIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

const { actions, reducer: betterReducer } = betterSlice;

export const { setIsEnterBetter, setIsOpen } = actions;

export default betterReducer;
