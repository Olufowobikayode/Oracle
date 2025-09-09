import { call, put, takeLatest, select } from 'redux-saga/effects';
import { analyzeNicheTrends } from '../../services/geminiService';
import { fetchTrendsStart, fetchTrendsSuccess, fetchTrendsFailure } from './trendsSlice';
import { setApiOutage } from '../apiStatus/apiStatusSlice';
// FIX: Import OracleSessionState from the central types file.
import type { TrendData, RootState, OracleSessionState } from '../../types';

function* handleFetchTrends(): Generator {
  try {
    const session: OracleSessionState = (yield select((state: RootState) => state.oracleSession)) as OracleSessionState;
    if (!session.isInitiated) {
      throw new Error("Oracle session not initiated.");
    }
    const trendsData = yield call(analyzeNicheTrends, session);
    yield put(fetchTrendsSuccess(trendsData as TrendData[]));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    if (errorMessage.includes("has exceeded its quota")) {
        yield put(setApiOutage(errorMessage));
    }
    yield put(fetchTrendsFailure(errorMessage));
  }
}

function* trendsSaga() {
  yield takeLatest(fetchTrendsStart.type, handleFetchTrends);
}

export default trendsSaga;