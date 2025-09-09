import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { OracleSessionState } from '../../types';

const initialState: OracleSessionState = {
  niche: '',
  purpose: '',
  targetAudience: '',
  brandVoice: '',
  isInitiated: false,
};

const oracleSessionSlice = createSlice({
  name: 'oracleSession',
  initialState,
  reducers: {
    initiateSession(state, action: PayloadAction<Omit<OracleSessionState, 'isInitiated'>>) {
      state.niche = action.payload.niche;
      state.purpose = action.payload.purpose;
      state.targetAudience = action.payload.targetAudience;
      state.brandVoice = action.payload.brandVoice;
      state.isInitiated = true;
    },
    clearSession(state) {
      state.niche = '';
      state.purpose = '';
      state.targetAudience = '';
      state.brandVoice = '';
      state.isInitiated = false;
    },
  },
});

export const { initiateSession, clearSession } = oracleSessionSlice.actions;
export default oracleSessionSlice.reducer;