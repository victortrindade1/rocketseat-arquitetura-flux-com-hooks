# Configurando o Redux

`yarn add redux react-redux`

## src/store

Nesta pasta ficam todos os arquivos relacionados ao Redux.

## src/store/index.js

```javascript
import { createStore } from 'redux';

import rootReducer from './modules/rootReducer';

const store = createStore(rootReducer);

export default store;
```

## src/store/modules

Na pasta modules vc coloca cada pasta de cada reducer.

## src/store/modules/rootReducer.js

Neste arquivo vc tem q colocar cada reducer. Pense num reducer como um conjunto
de dados de determinado objeto, como os dados do usuário, ou da session, ou do
carrinho... Este é um arquivo q vc vai viver incrementando reducers.

```javascript
import { combineReducers } from 'redux';

import cart from './cart/reducer';

export default combineReducers({
  cart,
});
```

## src/store/modules/cart/reducer.js

```javascript
export default function cart() {
  return [];
}
```

## src/App.js

```diff
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
+import { Provider } from 'react-redux';

import GlobalStyle from './styles/global';
import Header from './components/Header';
import Routes from './routes';

+import store from './store';

function App() {
  return (
+    <Provider store={store}>
      <BrowserRouter>
        <Header />
        <Routes />
        <GlobalStyle />
      </BrowserRouter>
+    </Provider>
  );
}

export default App;
```
