# Reactotron + Redux

`yarn add reactotron-react-js reactotron-redux`

Aqui com estes passos abaixo rodou liso. No início não chegou a aparecer a
connection, mas depois do primeiro console.tron.log apareceu.

## src/config/ReactotronConfig.js

```javascript
import Reactotron from 'reactotron-react-js';
import { reactotronRedux } from 'reactotron-redux';

if (process.env.NODE_ENV === 'development') {
  const tron = Reactotron.configure().use(reactotronRedux()).connect();

  tron.clear();

  console.tron = tron;
}
```

## .eslintrc.js

```diff
  rules: {
    'prettier/prettier': 'error',
    'react/jsx-filename-extension': ['warn', { extensions: ['.jsx', '.js'] }],
    'import/prefer-default-export': 'off',
    'react/state-in-constructor': ['off', 'always'],
+    'no-console': ['error', { allow: ['tron'] }],
  },
```

## src/store/index.js

Configurando o Reactotron com o Redux:

```diff
import { createStore } from 'redux';

import rootReducer from './modules/rootReducer';

+ const enhancer =
+   process.env.NODE_ENV === 'development' ? console.tron.createEnhancer() : null;

- const store = createStore(rootReducer);
+ const store = createStore(rootReducer, enhancer);

export default store;
```

## src/App.js

> É importante o Reactotron estar antes de store!

```diff
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

+ import './config/ReactotronConfig';

import GlobalStyle from './styles/global';
import Header from './components/Header';
import Routes from './routes';
```
