# Estilos Globais

`yarn add styled-components`

## Svg no background

Foi colocado uma imagem svg em `src/assets/images. Com o React é mt simples
colocar svg... só importar...

## src/styles/global.js

```javascript
import { createGlobalStyle } from 'styled-components';

import background from '../assets/images/background.svg';

export default createGlobalStyle`
  /* Olha como é fácil pegar uma fonte na API do google! */
  @import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');

  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  body {
    background: #191920 url(${background}) no-repeat center top;
    -webkit-font-smoothing: antialiased;
  }

  body, input, button {
    font: 14px Roboto, sans-serif;
  }

  #root {
    max-width: 1020px;
    margin: 0 auto;
    padding: 0 20px 50px;
  }

  button {
    cursor: pointer;
  }


`;
```

## src/App.js

```diff
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

+ import GlobalStyle from './styles/global';
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
+      <GlobalStyle />
    </BrowserRouter>
  );
}

export default App;
```
