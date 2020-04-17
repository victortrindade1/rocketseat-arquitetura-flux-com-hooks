# Refatorando as actions

Vamos organizar as actions e transformá-las em props. Cada action está associada
a um módulo específico. Vou colocar as actions nos módulos onde estão os
reducers.

## src/store/modules/cart/actions.js

```javascript
export function addToCart(product) {
  return {
    // É boa prática colocar o nome do módulo na frente, para facilitar na
    // visualização do reactotron
    type: '@cart/ADD',
    product,
  };
}

export function removeFromCart(id) {
  return {
    type: '@cart/REMOVE',
    id,
  };
}
```

## src/pages/Home/index.js

```diff
import React, { Component } from 'react';
import { connect } from 'react-redux';
+ import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { MdAddShoppingCart } from 'react-icons/md';
import { formatPriceBRL } from '../../util/format';
import api from '../../services/api';

+ import * as CartActions from '../../store/modules/cart/actions';

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

  handleAddProduct = (product) => {
-    /*
-    A partir do momento que vc usa o connect, vc passa a ter acesso à
-    propriedade dispatch, q serve para disparar actions
-    */
-    const { dispatch } = this.props;
-
-    dispatch({
-      type: 'ADD_TO_CART',
-      product,
-    });
+    const { addToCart } = this.props;
+
+    addToCart(product);
  };

  render() {
    const { products } = this.state;

    return (
      <ProductList>
        {products.map((product) => (
          <li key={product.id}>
            <img src={product.image} alt={product.title} />
            <strong>{product.title}</strong>
            <span>{product.priceBRL}</span>

            <button
              type="button"
              onClick={() => this.handleAddProduct(product)}
            >
              <div>
                <MdAddShoppingCart size={16} color="#fff" />
              </div>

              <span>ADICIONAR AO CARRINHO</span>
            </button>
          </li>
        ))}
      </ProductList>
    );
  }
}

- export default connect()(Home);
+ const mapDispatchToProps = (dispatch) =>
+   // Actions se tornam props
+   bindActionCreators(CartActions, dispatch);
+
+ // Primeiro argumento é null pois no lugar dele fica o mapStateToProps
+ export default connect(null, mapDispatchToProps)(Home);

Home.propTypes = {
-  dispatch: PropTypes.func.isRequired,
+  addToCart: PropTypes.func.isRequired,
};
```

## src/pages/Cart/index.js

```diff
import React from 'react';
import { connect } from 'react-redux';
+ import { bindActionCreators } from 'redux';
import {
  MdRemoveCircleOutline,
  MdAddCircleOutline,
  MdDelete,
} from 'react-icons/md';

+ import * as CartActions from '../../store/modules/cart/actions';

import { Container, ProductTable, Total } from './styles';

- function Cart({ cart, dispatch }) {
+ function Cart({ cart, removeFromCart }) {
  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((product) => (
            <tr>
              <td>
                <img src={product.image} alt={product.title} />
              </td>
              <td>
                <strong>{product.title}</strong>
                <span>{product.priceBRL}</span>
              </td>
              <td>
                <div>
                  <button type="button">
                    <MdRemoveCircleOutline size={20} color="#7159c1" />
                  </button>
                  <input type="number" readOnly value={product.amount} />
                  <button type="button">
                    <MdAddCircleOutline size={20} color="#7159c1" />
                  </button>
                </div>
              </td>
              <td>
                <strong>R$258,80</strong>
              </td>
              <td>
                <button type="button">
                  <MdDelete
                    size={20}
                    color="#7159c1"
-                    onClick={() =>
-                      dispatch({ type: 'REMOVE_FROM_CART', id: product.id })
-                    }
+                    onClick={() => removeFromCart(product.id)}
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>R$1920,28</strong>
        </Total>
      </footer>
    </Container>
  );
}

const mapStateToProps = (state) => ({
  cart: state.cart,
});

+ const mapDispatchToProps = (dispatch) =>
+   // Actions se tornam props
+   bindActionCreators(CartActions, dispatch);

- export default connect(mapStateToProps)(Cart);
+ export default connect(mapStateToProps, mapDispatchToProps)(Cart);
```

## src/store/modules/cart/reducer.js

```diff
import produce from 'immer';

export default function cart(state = [], action) {
  switch (action.type) {
-    case 'ADD_TO_CART':
+    case '@cart/ADD':
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
-    case 'REMOVE_FROM_CART':
+    case '@cart/REMOVE':
      return produce(state, (draft) => {
        const productIndex = draft.findIndex((p) => p.id === action.id);

        if (productIndex >= 0) {
          draft.splice(productIndex, 1);
        }
      });
    default:
      return state;
  }
}
```
