# Separando actions

Toda a lógica q está no reducer vai para o saga. Assim teremos um reducer limpo
e padronizado.

A action @cart/ADD_SUCCESS q hj incrementa amount no reducer, vai passar a
incrementar no saga. O q me dá a entender q qnd eu quero q o saga faça requests,
todo o tratamento do state para a response eu vou passar a manipular no saga e
não no reducer. Desta forma, o reducer fica limpo, e o saga... o saga...

## src/store/modules/cart/reducer.js

```diff
import produce from 'immer';

export default function cart(state = [], action) {
  switch (action.type) {
    case '@cart/ADD_SUCCESS':
      return produce(state, (draft) => {
-        // Procura se já existe o produto
-        const productIndex = draft.findIndex((p) => p.id === action.product.id);
-
-        if (productIndex >= 0) {
-          draft[productIndex].amount += 1;
-        } else {
-          // Ainda não existe o produto
-          draft.push({
-            ...action.product,
-            amount: 1,
-          });
-        }
+        const { product } = action;

+        draft.push(product);
      });
    case '@cart/REMOVE':
      return produce(state, (draft) => {
        const productIndex = draft.findIndex((p) => p.id === action.id);

        if (productIndex >= 0) {
          draft.splice(productIndex, 1);
        }
      });
    case '@cart/UPDATE_AMOUNT': {
      if (action.amount <= 0) {
        return state;
      }

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

## src/store/modules/cart/sagas.js

- select:
  Para acessar o state dentro do Saga.

```diff
- import { call, put, all, takeLatest } from 'redux-saga/effects';
+ import { call, select, put, all, takeLatest } from 'redux-saga/effects';

import api from '../../../services/api';
+ import { formatPriceBRL } from '../../../util/format';

- import { addToCartSuccess } from './actions';
+ import { addToCartSuccess, updateAmount } from './actions';


// function* addToCart(action) {
function* addToCart({ id }) {
  try {
+    const productExists = yield select((state) =>
+      state.cart.find((p) => p.id === id)
+    );
+
+    if (productExists) {
+      const amount = productExists.amount + 1;
+
+      yield put(updateAmount(id, amount));
+    } else {
      const response = yield call(api.get, `/products/${id}`);

+     const data = {
+       ...response.data,
+       amount: 1,
+       priceBRL: formatPriceBRL(response.data.price),
+     };

-     yield put(addToCartSuccess(response.data));
+     yield put(addToCartSuccess(data));
  } catch (err) {
    console.tron.log(err);
  }
}

export default all([takeLatest('@cart/ADD_REQUEST', addToCart)]);
```
