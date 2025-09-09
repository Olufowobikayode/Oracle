
import { all } from 'redux-saga/effects';
import trendsSaga from '../features/trends/trendsSaga';
import keywordsSaga from '../features/keywords/keywordsSaga';
import marketplacesSaga from '../features/marketplaces/marketplacesSaga';
import contentSaga from '../features/content/contentSaga';
import socialsSaga from '../features/socials/socialsSaga';
import copySaga from '../features/copy/copySaga';
import qnaSaga from '../features/qna/qnaSaga';
// FIX: Corrected import path for mediaSaga. It should be imported from the saga file, not the slice file.
import mediaSaga from '../features/media/mediaSaga';
import venturesSaga from '../features/ventures/venturesSaga';
import arbitrageSaga from '../features/arbitrage/arbitrageSaga';
import scenariosSaga from '../features/scenarios/scenariosSaga';
import comparisonSaga from '../features/comparison/comparisonSaga';
import authSaga from '../features/auth/authSaga';
import blogSaga from '../features/blog/blogSaga';
import apiStatusSaga from '../features/apiStatus/apiStatusSaga';

export default function* rootSaga() {
  yield all([
    trendsSaga(),
    keywordsSaga(),
    marketplacesSaga(),
    contentSaga(),
    socialsSaga(),
    copySaga(),
    qnaSaga(),
    mediaSaga(),
    venturesSaga(),
    arbitrageSaga(),
    scenariosSaga(),
    comparisonSaga(),
    authSaga(),
    blogSaga(),
    apiStatusSaga(),
  ]);
}