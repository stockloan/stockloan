import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Ialliance } from '@/api/AllianceApi';

export interface IallianceData {
  CODE: string;
  NAME: string;
  TEL_NUM: string;
  URL: string;
}

const initialState: IallianceData = {
  CODE: '2574',
  NAME: '코넥 스탁론',
  TEL_NUM: '1544-8125',
  URL: 'https://pf.kakao.com/_xmPxjVxj',
};
const allianceSlice = createSlice({
  name: 'alliance',
  initialState,
  reducers: {
    setStoreAlliance: (state, action: PayloadAction<Ialliance>) => {
      state.CODE = action.payload.attributes.CODE;
      state.NAME = action.payload.attributes.NAME;
      state.TEL_NUM = action.payload.attributes.TEL_NUM;
      state.URL = action.payload.attributes.URL;
    },
  },
});

const { actions, reducer: allianceReducer } = allianceSlice;

export const { setStoreAlliance } = actions;

export default allianceReducer;
