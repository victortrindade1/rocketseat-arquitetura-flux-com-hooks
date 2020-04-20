# Configurando o Redux Saga + Reactotron

O Redux Saga usa middlewares para interceptar actions, e criar side-effects.

`yarn add redux-saga reactotron-redux-saga`

O Redux Saga serve para fazer requests assíncronas.

Neste projeto, fará uma chamada API nos detalhes do produto ao adicioná-lo no
carrinho.

## src/store/modules/cart/sagas.js

```javascript
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
```

Functions Generator:
function\* = async
yield = await
É mais potente, pois async não tem suporte a algumas coisas

call:
O Redux Saga não deixa chamar api.get diretamente. O call é responsável por
chamar métodos assíncronos q retornam promisses.

put:
P/ o Saga disparar actions.

take:
Um dos métodos do Saga ouvir actions. Existe tb o takeEvery, takeLatest, etc.
Por ex, o takeLatest ouve apenas a última vez q o usuário clica num botão.
Isto serve para aqueles usuários q ficam punhetando achando q o programa vai
ficar mais rápido... Na última apertada, cancela as requests anteriores. Já
um takeEvery, ouviria todas as punhetadas. Serve para casos diferentes.

all:
Método do Saga para cadastrar vários listeners. Os listeners ficam ouvindo
qnd uma action é disparada

## src/store/modules/cart/actions.js

```diff
- export function addToCart(product) {
+ export function addToCartRequest(id) {
  return {
-   type: '@cart/ADD',
-   product,
+   type: '@cart/ADD_REQUEST',
+   id,
  };
}

+ export function addToCartSuccess(product) {
+   return {
+     type: '@cart/ADD_SUCCESS',
+     product,
+   };
+ }

export function removeFromCart(id) {
  return {
    type: '@cart/REMOVE',
    id,
  };
}

export function updateAmount(id, amount) {
  return {
    type: '@cart/UPDATE_AMOUNT',
    id,
    amount,
  };
}
```

## src/pages/Home/index.js

```diff
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { MdAddShoppingCart } from 'react-icons/md';
import { formatPriceBRL } from '../../util/format';
import api from '../../services/api';

import * as CartActions from '../../store/modules/cart/actions';

import { ProductList } from './styles';

class Home extends Component {
  state = {
    products: [],
  };

  async componentDidMount() {
    const response = await api.get('products');

    /*
    Formate o preço aqui. Não formate no render(), pois sempre q renderizar
    vai chamar a função.
    Fique atento! Analise bem se precisa usar uma função dentro do render!
    */
    const data = response.data.map((product) => ({
      ...product,
      priceBRL: formatPriceBRL(product.price),
    }));

    this.setState({ products: data });
  }

-  handleAddProduct = (product) => {
+  handleAddProduct = (id) => {
-    const { addToCart } = this.props;
+    const { addToCartRequest } = this.props;

-    addToCart(product);
+    addToCartRequest(id);
  };

  render() {
    const { products } = this.state;

    const { amount } = this.props;

    return (
      <ProductList>
        {products.map((product) => (
          <li key={product.id}>
            <img src={product.image} alt={product.title} />
            <strong>{product.title}</strong>
            <span>{product.priceBRL}</span>

            <button
              type="button"
-              onClick={() => this.handleAddProduct(product)}
+              onClick={() => this.handleAddProduct(product.id)}
            >
              <div>
                <MdAddShoppingCart size={16} color="#fff" />
                {amount[product.id] || ''}
              </div>

              <span>ADICIONAR AO CARRINHO</span>
            </button>
          </li>
        ))}
      </ProductList>
    );
  }
}

const mapStateToProps = (state) => ({
  // Quantidade daquele produto selecionado
  amount: state.cart.reduce((amount, product) => {
    amount[product.id] = product.amount;

    return amount;
  }, {}),
});

const mapDispatchToProps = (dispatch) =>
  // Actions se tornam props
  bindActionCreators(CartActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);

Home.propTypes = {
-  addToCart: PropTypes.func.isRequired,
+  addToCartRequest: PropTypes.func.isRequired,
};
```

## src/store/modules/cart/reducer.js

```diff
import produce from 'immer';

export default function cart(state = [], action) {
  switch (action.type) {
-   case '@cart/ADD':
+   case '@cart/ADD_SUCCESS':
      return produce(state, (draft) => {
        // Procura se já existe o produto
        const productIndex = draft.findIndex((p) => p.id === action.product.id);

        if (productIndex >= 0) {
          draft[productIndex].amount += 1;
        } else {
          // Ainda não existe o produto
          draft.push({
            ...action.product,
            amount: 1,
          });
        }
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

## src/store/modules/rootSaga.js

Possui a mesma finalidade do rootReducer. Assim como o rootReducer junta todos
os reducers, o rootSaga junta todos os sagas.

```javascript
import { all } from 'redux-saga/effects';

import cart from './cart/sagas';

export default function* rootSaga() {
  return yield all([
    cart,
    // saga 2,
    // saga 3
  ]);
}
```

## src/store/index.js

compose:
serve para dar merge em várias configurações. As configurações q quero unir
são do Reactotron (console.tron.createEnhancer()) e do
applyMiddleware(sagaMiddleware)

```diff
- import { createStore } from 'redux';
+ import { createStore, applyMiddleware, compose } from 'redux';

import rootReducer from './modules/rootReducer';
+ import rootSaga from './modules/rootSaga';

+ const sagaMonitor =
+   process.env.NODE_ENV === 'development'
+     ? console.tron.createSagaMonitor()
+     : null;

+ const sagaMiddleware = createSagaMiddleware({
+   sagaMonitor,
+ });

const enhancer =
-  process.env.NODE_ENV === 'development' ? console.tron.createEnhancer() : null;
+ process.env.NODE_ENV === 'development'
+    ? compose(console.tron.createEnhancer(), applyMiddleware(sagaMiddleware))
+    : applyMiddleware(sagaMiddleware);

const store = createStore(rootReducer, enhancer);

+ sagaMiddleware.run(rootSaga);

export default store;
```

## src/config/ReactotronConfig.js

```diff
import Reactotron from 'reactotron-react-js';
import { reactotronRedux } from 'reactotron-redux';
+ import reactotronSaga from 'reactotron-redux-saga';

if (process.env.NODE_ENV === 'development') {
-  const tron = Reactotron.configure().use(reactotronRedux()).connect();
+  const tron = Reactotron.configure()
+    .use(reactotronRedux())
+    .use(reactotronSaga())
+    .connect();

  tron.clear();

  console.tron = tron;
}
```
