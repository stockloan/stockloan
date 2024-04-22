import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ISearchedState {
  searched: string[];
  searchedParams: string[];
}

const initialState: ISearchedState = {
  searched: [],
  searchedParams: [],
};
const searchedStock = createSlice({
  name: 'searchedStock',
  initialState,
  reducers: {
    setSearchedStock: (state, action: PayloadAction<string>) => {
      const stockList = state.searched.filter(
        (item) => item !== action.payload
      );
      stockList.unshift(action.payload);
      state.searched = [...stockList];
    },
    setSearchedParamsList: (state, action: PayloadAction<string>) => {
      const paramsList = state.searchedParams.filter(
        (item) => item !== action.payload
      );
      paramsList.unshift(action.payload);
      state.searchedParams = [...paramsList];
    },
    deleteSearchedParamsList: (state, action: PayloadAction<string>) => {
      const paramsList = state.searchedParams.filter(
        (item) => item !== action.payload
      );
      state.searchedParams = [...paramsList];
    },
  },
});

// const { actions, reducer: stockReducer } = searchedStock;

export const {
  setSearchedStock,
  setSearchedParamsList,
  deleteSearchedParamsList,
} = searchedStock.actions;

export default searchedStock.reducer;
