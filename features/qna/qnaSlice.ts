
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { QnaState, ChatMessage } from '../../types';

const initialState: QnaState = {
  messages: [
    {
      role: 'assistant',
      content: "I have analyzed the provided reports. How can I help you further?",
    },
  ],
  loading: false,
  error: null,
};

const qnaSlice = createSlice({
  name: 'qna',
  initialState,
  reducers: {
    sendQuestionStart(state, action: PayloadAction<{ question: string; selectedContexts: string[] }>) {
      state.messages.push({ role: 'user', content: action.payload.question });
      state.loading = true;
      state.error = null;
    },
    sendQuestionSuccess(state, action: PayloadAction<string>) {
      state.messages.push({ role: 'assistant', content: action.payload });
      state.loading = false;
    },
    sendQuestionFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.messages.push({ role: 'assistant', content: `I'm sorry, I encountered an error. ${action.payload}` });
    },
  },
});

export const { sendQuestionStart, sendQuestionSuccess, sendQuestionFailure } = qnaSlice.actions;
export default qnaSlice.reducer;