
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TrendsState, TrendData } from '../../types';

const initialState: TrendsState = {
  data: [],
  loading: false,
  error: null,
};

const trendsSlice = createSlice({
  name: 'trends',
  initialState,
  reducers: {
    fetchTrendsStart(state) {
      state.loading = true;
      state.error = null;
      state.data = [];
    },
    fetchTrendsSuccess(state, action: PayloadAction<TrendData[]>) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchTrendsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchTrendsStart, fetchTrendsSuccess, fetchTrendsFailure } = trendsSlice.actions;
export default trendsSlice.reducer;