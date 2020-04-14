# Criando Header

O Header vai ter a logo e o carrinho de compras. O carrinho vamos pegar no
`react-icons`.

`yarn add react-icons`

## src/components/

A pasta components é pra componentes q não são necessariamente de alguma página.

### src/components/Header/index.js

```javascript
import React from 'react';
import { Link } from 'react-router-dom';

import { MdShoppingBasket } from 'react-icons/md';

import { Container, Cart } from './styles';

import logo from '../../assets/images/logo.svg';

export default function Header() {
  return (
    <Container>
      <Link to="/">
        <img src={logo} alt="Rocketshoes" />
      </Link>

      <Cart to="/cart">
        <div>
          <strong>Meu carrinho</strong>
          <span>3 itens</span>
        </div>
        <MdShoppingBasket size={36} color="#FFF" />
      </Cart>
    </Container>
  );
}
```

### src/components/Header/styles.js

```javascript
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 50px 0;
`;

export const Cart = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }

  div {
    text-align: right;
    margin-right: 10px;

    strong {
      display: block;
      color: #fff;
    }

    span {
      font-size: 12px;
      color: #999;
    }
  }
`;
```

### src/App.js

```diff
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import GlobalStyle from './styles/global';
+ import Header from './components/Header';
import Routes from './routes';

function App() {
  return (
    /**
     * O BrowserRouter fica geralmente no routes.js. Nesse projeto ele está aqui
     * pq o Header vai possuir navegação e, por isso, vai precisar acessar as
     * propriedades de navegação do router-dom.
     */
    <BrowserRouter>
+      <Header />
      <Routes />
      <GlobalStyle />
    </BrowserRouter>
  );
}

export default App;
```
