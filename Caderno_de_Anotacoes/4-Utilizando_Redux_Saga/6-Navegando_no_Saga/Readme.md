# Navegando no Saga

Após adicionar ao carrinho, o usuário será redirecionado ao carrinho.

Vc deve redirecionar por dentro do saga, pois senão o app te redirecionará antes
do saga terminar a request.

Para redirecionar, vou usar a lib `history`, q manipula URLs no browser.

`yarn add history`

## src/services/history.js

```javascript
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

export default history;
```

## src/App.js

```diff
import React from 'react';
- import { BrowserRouter } from 'react-router-dom';
+ import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import './config/ReactotronConfig';

import GlobalStyle from './styles/global';
import Header from './components/Header';
import Routes from './routes';

+ import history from './services/history';
import store from './store';

function App() {
  return (
    <Provider store={store}>
-      {/* O BrowserRouter fica geralmente no routes.js. Nesse projeto ele está
-      aqui * pq o Header vai possuir navegação e, por isso, vai precisar acessar
-      as * propriedades de navegação do router-dom. */}
-      <BrowserRouter>
+      <Router history={history}>
        <Header />
        <Routes />
        <GlobalStyle />
        <ToastContainer autoClose={3000} />
-      </BrowserRouter>
+      </Router>
    </Provider>
  );
}

export default App;
```

## src/store/modules/cart/sagas.js

```diff
import { call, select, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import api from '../../../services/api';
+ import history from '../../../services/history';
import { formatPriceBRL } from '../../../util/format';

import { addToCartSuccess, updateAmountSuccess } from './actions';

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
      yield put(updateAmountSuccess(id, amount));
    } else {
      // const response = yield call(api.get, `/products/${action.id}`);
      const response = yield call(api.get, `/products/${id}`);

      const data = {
        ...response.data,
        amount: 1,
        priceBRL: formatPriceBRL(response.data.price),
      };

      yield put(addToCartSuccess(data));

+      // Redireciona p/ o carrinho
+      history.push('/cart');
    }
  } catch (err) {
    console.tron.log(err);
  }
}

function* updateAmount({ id, amount }) {
  if (amount <= 0) return;

  const stock = yield call(api.get, `stock/${id}`);
  const stockAmount = stock.data.amount;

  if (amount > stockAmount) {
    toast.error('Quantidade solicitada fora de estoque');
    return;
  }

  yield put(updateAmountSuccess(id, amount));
}

export default all([
  takeLatest('@cart/ADD_REQUEST', addToCart),
  takeLatest('@cart/UPDATE_AMOUNT_REQUEST', updateAmount),
]);
```
