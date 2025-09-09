import { call, put, takeLatest, select } from 'redux-saga/effects';
import { analyzeMarketplaces } from '../../services/geminiService';
import { fetchMarketplacesStart, fetchMarketplacesSuccess, fetchMarketplacesFailure } from './marketplacesSlice';
import { setApiOutage } from '../apiStatus/apiStatusSlice';
// FIX: Import OracleSessionState from the central types file.
import type { MarketplaceData, RootState, OracleSessionState } from '../../types';

function* handleFetchMarketplaces(): Generator {
  try {
    const session: OracleSessionState = (yield select((state: RootState) => state.oracleSession)) as OracleSessionState;
     if (!session.isInitiated) {
      throw new Error("Oracle session not initiated.");
    }
    const marketplacesData = yield call(analyzeMarketplaces, session);
    yield put(fetchMarketplacesSuccess(marketplacesData as MarketplaceData[]));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    if (errorMessage.includes("has exceeded its quota")) {
        yield put(setApiOutage(errorMessage));
    }
    yield put(fetchMarketplacesFailure(errorMessage));
  }
}

function* marketplacesSaga() {
  yield takeLatest(fetchMarketplacesStart.type, handleFetchMarketplaces);
}

export default marketplacesSaga;