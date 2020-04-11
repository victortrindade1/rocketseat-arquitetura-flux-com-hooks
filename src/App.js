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
