
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { KeywordsState, KeywordData } from '../../types';

const initialState: KeywordsState = {
  data: [],
  loading: false,
  error: null,
};

const keywordsSlice = createSlice({
  name: 'keywords',
  initialState,
  reducers: {
    fetchKeywordsStart(state) {
      state.loading = true;
      state.error = null;
      state.data = [];
    },
    fetchKeywordsSuccess(state, action: PayloadAction<KeywordData[]>) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchKeywordsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchKeywordsStart, fetchKeywordsSuccess, fetchKeywordsFailure } = keywordsSlice.actions;
export default keywordsSlice.reducer;