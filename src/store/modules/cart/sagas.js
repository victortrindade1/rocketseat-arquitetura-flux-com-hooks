import { call, put, all, takeLatest } from 'redux-saga/effects';

import api from '../../../services/api';

import { addToCartSuccess } from './actions';

// function* addToCart(action) {
function* addToCart({ id }) {
  try {
    // const response = yield call(api.get, `/products/${action.id}`);
    const response = yield call(api.get, `/products/${id}`);

    yield put(addToCartSuccess(response.data));
  } catch (err) {
    console.tron.log(err);
  }
}

export default all([takeLatest('@cart/ADD_REQUEST', addToCart)]);
