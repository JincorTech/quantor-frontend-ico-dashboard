import { all, takeLatest, call, put, fork } from 'redux-saga/effects';
import { post } from '../../utils/fetch';

import { initVerification } from '../../redux/modules/verification/verification';

/**
 * Init verification
 */

function* initVerificationIterator({ payload }) {
  try {
    const data = yield call(post, '/kyc/init', payload);
    yield put(initVerification.success(data));
  } catch (e) {
    yield put(initVerification.failure(e));
  }
}

function* initVerificationSaga() {
  yield takeLatest(
    initVerification.REQUEST,
    initVerificationIterator
  );
}

/**
 * Export
 */

export default function* () {
  yield all([
    fork(initVerificationSaga)
  ]);
}
