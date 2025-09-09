import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { MediaState, MediaJob, MediaAsset, StackType } from '../../types';

const initialState: MediaState = {
  jobs: {},
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    // Image Actions
    // FIX: Add cardId and stackType to payload to associate job with a card.
    generateImageStart(state, action: PayloadAction<{ prompt: string, aspectRatio: string, cardId?: string, stackType?: StackType }>) {
        // Saga handles job creation via progress action.
    },
    // FIX: Add a progress action for images to align with the video generation flow.
    generateImageProgress(state, action: PayloadAction<{ jobId: string; prompt: string; originatingCardId?: string; stackType?: StackType }>) {
        const { jobId, prompt, originatingCardId, stackType } = action.payload;
        state.jobs[jobId] = {
            jobId,
            status: 'processing',
            progress: 50,
            prompt,
            originatingCardId,
            stackType,
        };
    },
    generateImageSuccess(state, action: PayloadAction<{ jobId: string; asset: MediaAsset }>) {
        const { jobId, asset } = action.payload;
        if(state.jobs[jobId]){
            state.jobs[jobId].status = 'completed';
            state.jobs[jobId].progress = 100;
            state.jobs[jobId].asset = asset;
        }
    },
    generateImageFailure(state, action: PayloadAction<{ jobId: string; error: string }>) {
        const { jobId, error } = action.payload;
        if(state.jobs[jobId]){
            state.jobs[jobId].status = 'failed';
            state.jobs[jobId].progress = 100;
            state.jobs[jobId].error = error;
        }
    },
    
    // Video Actions
    // FIX: Add cardId and stackType to payload to associate job with a card.
    generateVideoStart(state, action: PayloadAction<{ prompt: string, cardId?: string, stackType?: StackType }>) {
        // Handled by saga, which will dispatch progress immediately
    },
    // FIX: Add originatingCardId and stackType to payload to create job with card association.
    generateVideoProgress(state, action: PayloadAction<{ jobId: string; status: 'queued' | 'processing', progress: number; prompt: string; originatingCardId?: string; stackType?: StackType }>) {
        const { jobId, status, progress, prompt, originatingCardId, stackType } = action.payload;
        if (!state.jobs[jobId]) {
            state.jobs[jobId] = { jobId, status, progress, prompt, originatingCardId, stackType };
        } else {
            state.jobs[jobId].status = status;
            state.jobs[jobId].progress = progress;
        }
    },
    generateVideoSuccess(state, action: PayloadAction<{ jobId: string; asset: MediaAsset }>) {
        const { jobId, asset } = action.payload;
        if(state.jobs[jobId]){
            state.jobs[jobId].status = 'completed';
            state.jobs[jobId].progress = 100;
            state.jobs[jobId].asset = asset;
        }
    },
    generateVideoFailure(state, action: PayloadAction<{ jobId: string; error: string }>) {
        const { jobId, error } = action.payload;
        if(state.jobs[jobId]){
            state.jobs[jobId].status = 'failed';
            state.jobs[jobId].progress = 100;
            state.jobs[jobId].error = error;
        }
    },
  },
});

export const { 
    generateImageStart, 
    generateImageProgress,
    generateImageSuccess, 
    generateImageFailure,
    generateVideoStart,
    generateVideoProgress,
    generateVideoSuccess,
    generateVideoFailure
} = mediaSlice.actions;

export default mediaSlice.reducer;