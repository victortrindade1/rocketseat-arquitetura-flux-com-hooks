import { call, select, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import api from '../../../services/api';
import { formatPriceBRL } from '../../../util/format';

import { addToCartSuccess, updateAmount } from './actions';

// function* addToCart(action) {
function* addToCart({ id }) {
  try {
    const productExists = yield select((state) =>
      state.cart.find((p) => p.id === id)
    );

    const stock = yield call(api.get, `/stock/${id}`);

    const stockAmount = stock.data.amount;
    const currentAmount = productExists ? productExists.amount : 0;

    const amount = currentAmount + 1;

    if (amount > stockAmount) {
      // console.tron.warn('Error: no product in stock');
      toast.error('Quantidade solicitada fora de estoque');
      return; // Exit na função
    }

    if (productExists) {
      yield put(updateAmount(id, amount));
    } else {
      // const response = yield call(api.get, `/products/${action.id}`);
      const response = yield call(api.get, `/products/${id}`);

      const data = {
        ...response.data,
        amount: 1,
        priceBRL: formatPriceBRL(response.data.price),
      };

      yield put(addToCartSuccess(data));
    }
  } catch (err) {
    console.tron.log(err);
  }
}

export default all([takeLatest('@cart/ADD_REQUEST', addToCart)]);
