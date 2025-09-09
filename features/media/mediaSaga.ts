import { call, put, takeLatest, all, delay, select } from 'redux-saga/effects';
import { 
    generateImageFromPrompt,
    generateVideoFromPrompt,
    checkVideoOperationStatus,
    getCurrentApiKey
} from '../../services/geminiService';
// FIX: Import generateImageProgress and align with the more robust video generation flow.
import { 
    generateImageStart, 
    generateImageProgress,
    generateImageSuccess, 
    generateImageFailure,
    generateVideoStart,
    generateVideoProgress,
    generateVideoSuccess,
    generateVideoFailure
} from './mediaSlice';
import { setApiOutage } from '../apiStatus/apiStatusSlice';
import type { PayloadAction } from '@reduxjs/toolkit';
// FIX: Add StackType to imports
import type { RootState, MediaJob, StackType } from '../../types';

// --- IMAGE GENERATION ---
// FIX: Refactor to align with video generation saga pattern. This creates the job via a progress action first.
// Also corrected the payload to accept cardId and stackType for proper job association.
function* handleGenerateImage(action: PayloadAction<{ prompt: string; aspectRatio: string; cardId?: string; stackType?: StackType }>): Generator {
  const { prompt, aspectRatio, cardId, stackType } = action.payload;
  const jobId = `img-${Date.now()}`;
  try {
    yield put(generateImageProgress({ jobId, prompt, originatingCardId: cardId, stackType }));
    const imageUrl = yield call(generateImageFromPrompt, prompt, aspectRatio);
    yield put(generateImageSuccess({
      jobId,
      asset: {
        id: `asset-${Date.now()}`,
        type: 'image',
        url: imageUrl as string,
        prompt: prompt,
      }
    }));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    if (errorMessage.includes("has exceeded its quota")) {
        yield put(setApiOutage(errorMessage));
    }
    yield put(generateImageFailure({ jobId, error: errorMessage }));
  }
}

// --- VIDEO GENERATION ---
// FIX: Update action payload to include cardId and stackType for job association.
function* handleGenerateVideo(action: PayloadAction<{ prompt: string; cardId?: string; stackType?: StackType }>): Generator {
    const { prompt, cardId, stackType } = action.payload;
    const jobId = `vid-${Date.now()}`;
    try {
        // FIX: Pass card info to generateVideoProgress.
        yield put(generateVideoProgress({ jobId, status: 'queued', progress: 5, prompt, originatingCardId: cardId, stackType }));
        
        let operation = yield call(generateVideoFromPrompt, prompt);
        // FIX: Pass card info to generateVideoProgress.
        yield put(generateVideoProgress({ jobId, status: 'processing', progress: 15, prompt, originatingCardId: cardId, stackType }));

        while (operation && !(operation as any).done) {
            yield delay(10000); // Poll every 10 seconds
            operation = yield call(checkVideoOperationStatus, operation);
            
            const currentJob = (yield select((state: RootState) => state.media.jobs[jobId])) as MediaJob | undefined;
            const currentProgress = currentJob ? currentJob.progress : 15;
            const nextProgress = Math.min(currentProgress + 10, 90);

            // FIX: Pass card info to generateVideoProgress.
            yield put(generateVideoProgress({ jobId, status: 'processing', progress: nextProgress, prompt, originatingCardId: cardId, stackType }));
        }

        const videoUri = (operation as any).response?.generatedVideos?.[0]?.video?.uri;
        if (!videoUri) {
            throw new Error("Video generation completed but no video URI was found.");
        }
        
        const workingApiKey = yield call(getCurrentApiKey);
        const finalUrl = `${videoUri}&key=${workingApiKey}`;
        
        yield put(generateVideoSuccess({
            jobId,
            asset: {
                id: `asset-${Date.now()}`,
                type: 'video',
                url: finalUrl,
                prompt,
            }
        }));

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (errorMessage.includes("has exceeded its quota")) {
            yield put(setApiOutage(errorMessage));
        }
        yield put(generateVideoFailure({ jobId, error: errorMessage }));
    }
}

// --- WATCHERS ---
function* mediaSaga() {
  yield takeLatest(generateImageStart.type, handleGenerateImage);
  yield takeLatest(generateVideoStart.type, handleGenerateVideo);
}

export default mediaSaga;