
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ContentState, ContentData } from '../../types';

const initialState: ContentState = {
  data: [],
  loading: false,
  error: null,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    // FIX: Update fetchContentStart to accept an optional payload.
    // This allows passing a topic from the Blog Admin page.
    fetchContentStart(state, action: PayloadAction<{ topic: string } | undefined>) {
      state.loading = true;
      state.error = null;
      state.data = [];
    },
    fetchContentSuccess(state, action: PayloadAction<ContentData[]>) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchContentFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchContentStart, fetchContentSuccess, fetchContentFailure } = contentSlice.actions;
export default contentSlice.reducer;
