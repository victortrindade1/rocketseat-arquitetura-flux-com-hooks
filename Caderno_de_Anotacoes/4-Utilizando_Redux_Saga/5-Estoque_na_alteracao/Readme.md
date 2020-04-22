# Estoque na alteração

Na adição ao carrinho, o usuário já não consegue acrescentar mais do q o
estoque. Porém, dentro do carrinho, ainda consegue. Vamos consertar isto.

> Sempre q for trabalhar com saga, a action divide um duas actions

## src/store/modules/cart/actions.js

```diff
export function addToCartRequest(id) {
  return {
    // É boa prática colocar o nome do módulo na frente, para facilitar na
    // visualização do reactotron
    type: '@cart/ADD_REQUEST',
    id,
  };
}

export function addToCartSuccess(product) {
  return {
    type: '@cart/ADD_SUCCESS',
    product,
  };
}

export function removeFromCart(id) {
  return {
    type: '@cart/REMOVE',
    id,
  };
}

- export function updateAmount(id, amount) {
+ export function updateAmountRequest(id, amount) {
  return {
-   type: '@cart/UPDATE_AMOUNT',
+   type: '@cart/UPDATE_AMOUNT_REQUEST',
    id,
    amount,
  };
}

+ export function updateAmountSuccess(id, amount) {
+   return {
+     type: '@cart/UPDATE_AMOUNT_SUCCESS',
+     id,
+     amount,
+   };
+ }
```

## src/pages/Cart/index.js

```diff
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  MdRemoveCircleOutline,
  MdAddCircleOutline,
  MdDelete,
} from 'react-icons/md';

import * as CartActions from '../../store/modules/cart/actions';

import { formatPriceBRL } from '../../util/format';

import { Container, ProductTable, Total } from './styles';

- function Cart({ cart, total, removeFromCart, updateAmount }) {
+ function Cart({ cart, total, removeFromCart, updateAmountRequest }) {
  function increment(product) {
-   updateAmount(product.id, product.amount + 1);
+   updateAmountRequest(product.id, product.amount + 1);
  }

  function decrement(product) {
-    updateAmount(product.id, product.amount - 1);
+    updateAmountRequest(product.id, product.amount - 1);
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((product) => (
            <tr>
              <td>
                <img src={product.image} alt={product.title} />
              </td>
              <td>
                <strong>{product.title}</strong>
                <span>{product.priceBRL}</span>
              </td>
              <td>
                <div>
                  <button type="button" onClick={() => decrement(product)}>
                    <MdRemoveCircleOutline size={20} color="#7159c1" />
                  </button>
                  <input type="number" readOnly value={product.amount} />
                  <button type="button" onClick={() => increment(product)}>
                    <MdAddCircleOutline size={20} color="#7159c1" />
                  </button>
                </div>
              </td>
              <td>
                <strong>{product.subtotal}</strong>
              </td>
              <td>
                <button type="button">
                  <MdDelete
                    size={20}
                    color="#7159c1"
                    onClick={() => removeFromCart(product.id)}
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
}

const mapStateToProps = (state) => ({
  cart: state.cart.map((product) => ({
    ...product,
    subtotal: formatPriceBRL(product.price * product.amount),
  })),
  total: formatPriceBRL(
    state.cart.reduce((total, product) => {
      return total + product.price * product.amount;
    }, 0)
  ),
});

const mapDispatchToProps = (dispatch) =>
  // Actions se tornam props
  bindActionCreators(CartActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
```

## src/store/modules/cart/sagas.js

```diff
import { call, select, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import api from '../../../services/api';
import { formatPriceBRL } from '../../../util/format';

- import { addToCartSuccess, updateAmount } from './actions';
+ import { addToCartSuccess, updateAmountSuccess } from './actions';


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

+ function* updateAmount({ id, amount }) {
+   if (amount <= 0) return;
+
+   const stock = yield call(api.get, `stock/${id}`);
+   const stockAmount = stock.data.amount;
+
+   if (amount > stockAmount) {
+     toast.error('Quantidade solicitada fora de estoque');
+     return;
+   }
+
+   yield put(updateAmountSuccess(id, amount));
+ }

- export default all([takeLatest('@cart/ADD_REQUEST', addToCart)]);
+ export default all([
+   takeLatest('@cart/ADD_REQUEST', addToCart),
+   takeLatest('@cart/UPDATE_AMOUNT_REQUEST', updateAmount),
+ ]);
```

## src/store/modules/cart/reducer.js

```diff
import produce from 'immer';

export default function cart(state = [], action) {
  switch (action.type) {
    case '@cart/ADD_SUCCESS':
      return produce(state, (draft) => {
        const { product } = action;

        draft.push(product);
      });
    case '@cart/REMOVE':
      return produce(state, (draft) => {
        const productIndex = draft.findIndex((p) => p.id === action.id);

        if (productIndex >= 0) {
          draft.splice(productIndex, 1);
        }
      });
-    case '@cart/UPDATE_AMOUNT': {
+    case '@cart/UPDATE_AMOUNT_SUCCESS': {

-      if (action.amount <= 0) {
-        return state;
-      }

      return produce(state, (draft) => {
        const productIndex = draft.findIndex((p) => p.id === action.id);

        if (productIndex >= 0) {
          draft[productIndex].amount = Number(action.amount);
        }
      });
    }
    default:
      return state;
  }
}
```
