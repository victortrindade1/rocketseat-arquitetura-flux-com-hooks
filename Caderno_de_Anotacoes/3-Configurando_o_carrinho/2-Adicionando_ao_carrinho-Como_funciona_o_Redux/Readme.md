# Adicionando ao carrinho

Como funciona o Redux:

Em `Home`, ao clicar no produto pra `Adicionar ao carrinho`, dispara uma action
no button. Esta action é um objeto com um `type` e o restante do conteúdo q a
gnt quer. A action é declarada no reducer.

Para acessar o estado global do Redux em um component qualquer vc só precisa
usar uma função `connect` do Redux dentro deste component.

## src/pages/Home/index.js

```diff
import React, { Component } from 'react';
+ import { connect } from 'react-redux';
+ import PropTypes from 'prop-types';
import { MdAddShoppingCart } from 'react-icons/md';
import { formatPriceBRL } from '../../util/format';
import api from '../../services/api';

import { ProductList } from './styles';

- export default class Home extends Component {
+ class Home extends Component {
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

+  handleAddProduct = (product) => {
+    /*
+    A partir do momento que vc usa o connect, vc passa a ter acesso à
+    propriedade dispatch, q serve para disparar actions
+    */
+    const { dispatch } = this.props;
+
+    dispatch({
+      type: 'ADD_TO_CART',
+      product,
+    });
+  };

  render() {
    const { products } = this.state;

    return (
      <ProductList>
        {products.map((product) => (
          <li key={product.id}>
            <img src={product.image} alt={product.title} />
            <strong>{product.title}</strong>
            <span>{product.priceBRL}</span>

-            <button type="button">
+            <button
+              type="button"
+              onClick={() => this.handleAddProduct(product)}
+            >
              <div>
                <MdAddShoppingCart size={16} color="#fff" /> 3
              </div>

              <span>ADICIONAR AO CARRINHO</span>
            </button>
          </li>
        ))}
      </ProductList>
    );
  }
}

+ export default connect()(Home);
+
+ Home.propTypes = {
+   dispatch: PropTypes.func.isRequired,
+ };
```

## src/store/modules/cart/reducer.js

```javascript
export default function cart(state = [], action) {
  switch (action.type) {
    case 'ADD_TO_CART':
      return [...state, action.product];
    default:
      return state;
  }
}
```

## src/components/Header/index.js

Aqui foi tudo feito dentro de `connect()`, mas o ideal é criar um
`mapStateToProps`, q transforma as informações do estado em propriedades para
o component. Veja exemplo mais a frente em `4-Listando_no_carrinho`.

```diff
import React from 'react';
+ import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
+ import { connect } from 'react-redux';

import { MdShoppingBasket } from 'react-icons/md';

import { Container, Cart } from './styles';

import logo from '../../assets/images/logo.svg';

- export default function Header() {
+ function Header({ cartSize }) {
  return (
    <Container>
      <Link to="/">
        <img src={logo} alt="Rocketshoes" />
      </Link>

      <Cart to="/cart">
        <div>
          <strong>Meu carrinho</strong>
-          <span>3 itens</span>
+          <span>{cartSize} itens</span>
        </div>
        <MdShoppingBasket size={36} color="#FFF" />
      </Cart>
    </Container>
  );
}

+ export default connect((state) => ({
+   cartSize: state.cart.length,
+ }))(Header);
+
+ Header.propTypes = {
+   cartSize: PropTypes.number.isRequired,
+ };
```
