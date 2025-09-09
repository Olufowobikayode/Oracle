import { call, put, takeLatest, select } from 'redux-saga/effects';
import { answerQuestionWithContext } from '../../services/geminiService';
import { sendQuestionStart, sendQuestionSuccess, sendQuestionFailure } from './qnaSlice';
import { setApiOutage } from '../apiStatus/apiStatusSlice';
import type { RootState } from '../../types';
import type { PayloadAction } from '@reduxjs/toolkit';

function* handleSendQuestion(action: PayloadAction<{ question: string; selectedContexts: string[] }>): Generator {
  try {
    const { question, selectedContexts } = action.payload;
    const fullState = (yield select()) as RootState;
    const session = fullState.oracleSession;

    const contextData: { [key: string]: any } = {};
    if (selectedContexts.includes('trends') && fullState.trends.data.length > 0) {
      contextData.marketAnalysis = fullState.trends.data;
    }
    if (selectedContexts.includes('keywords') && fullState.keywords.data.length > 0) {
      contextData.keywordResearch = fullState.keywords.data;
    }
    if (selectedContexts.includes('marketplaces') && fullState.marketplaces.data.length > 0) {
      contextData.platformFinder = fullState.marketplaces.data;
    }
    if (selectedContexts.includes('content') && fullState.content.data.length > 0) {
      contextData.contentStrategy = fullState.content.data;
    }
    if (selectedContexts.includes('socials') && fullState.socials.data.length > 0) {
      contextData.socialMediaStrategy = fullState.socials.data;
    }
    if (selectedContexts.includes('copy') && fullState.copy.data.length > 0) {
      contextData.copywriting = fullState.copy.data;
    }
    if (selectedContexts.includes('arbitrage') && fullState.arbitrage.data.length > 0) {
      contextData.salesArbitrage = fullState.arbitrage.data;
    }
    if (selectedContexts.includes('scenarios') && fullState.scenarios.data.length > 0) {
      contextData.scenarioPlanner = fullState.scenarios.data;
    }


    const context = JSON.stringify(contextData, null, 2);

    const answer = yield call(answerQuestionWithContext, session, context, question);
    yield put(sendQuestionSuccess(answer as string));

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    if (errorMessage.includes("has exceeded its quota")) {
        yield put(setApiOutage(errorMessage));
    }
    yield put(sendQuestionFailure(errorMessage));
  }
}

function* qnaSaga() {
  yield takeLatest(sendQuestionStart.type, handleSendQuestion);
}

export default qnaSaga;