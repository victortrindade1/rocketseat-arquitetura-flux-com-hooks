# Configurando rotas

`yarn add react-router-dom`

## src/index.js

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```

## src/App.js

```javascript
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Routes from './routes';

function App() {
  return (
    /**
     * O BrowserRouter fica geralmente no routes.js. Nesse projeto ele está aqui
     * pq o Header vai possuir navegação e, por isso, vai precisar acessar as
     * propriedades de navegação do router-dom.
     */
    <BrowserRouter>
      {/* <Header /> */}
      <Routes />
    </BrowserRouter>
  );
}

export default App;
```

## src/routes.js

```javascript
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Cart from './pages/Cart';
import Home from './pages/Home';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/cart" component={Cart} />
    </Switch>
  );
}
```

## src/pages/Home/index.js

```javascript
import React from 'react';

// import { Container } from './styles';

export default function Home() {
  return <h1>Home</h1>;
}
```

## src/pages/Cart/index.js

```javascript
import React from 'react';

// import { Container } from './styles';

export default function Cart() {
  return <h1>Carrinho</h1>;
}
```
