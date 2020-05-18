# Hooks com Redux

- Os hooks facilitaram bastante a vida do Redux, deixando menos verboso.
- Antes, para transformar estado em props, usávamos o `mapStateToProps`. Agora,
  iremos usar `useSelector()`, e transformar estado em variável const
- Antes, para transformar actions em props, usávamos o `mapDispatchToProps`.
  Agora, iremos usar `useDispatch()`, e transformar actions em variável const.
- Nada altera nos reducers e sagas. Toda a mudança é nos components.

## src/components/Header/index.js

```diff
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
-import { connect } from 'react-redux';
+import { useSelector } from 'react-redux';

import { MdShoppingBasket } from 'react-icons/md';

import { Container, Cart } from './styles';

import logo from '../../assets/images/logo.svg';

-function Header({ cartSize }) {
+export default function Header() {
+  const cartSize = useSelector((state) => state.cart.length);

  return (
    <Container>
      <Link to="/">
        <img src={logo} alt="Rocketshoes" />
      </Link>

      <Cart to="/cart">
        <div>
          <strong>Meu carrinho</strong>
          <span>{cartSize} itens</span>
        </div>
        <MdShoppingBasket size={36} color="#FFF" />
      </Cart>
    </Container>
  );
}

-export default connect((state) => ({
-  cartSize: state.cart.length,
-}))(Header);
-
-Header.propTypes = {
-  cartSize: PropTypes.number.isRequired,
-};
```

## src/pages/Home/index.js

```diff
import React, { useState, useEffect } from 'react';
-import { connect } from 'react-redux';
+import { useSelector, useDispatch } from 'react-redux';
-import { bindActionCreators } from 'redux';
-import PropTypes from 'prop-types';
import { MdAddShoppingCart } from 'react-icons/md';
import { formatPriceBRL } from '../../util/format';
import api from '../../services/api';

import * as CartActions from '../../store/modules/cart/actions';

import { ProductList } from './styles';

-function Home({ amount, addToCartRequest }) {
+export default function Home() {
  const [products, setProducts] = useState([]);

+  const amount = useSelector((state) => {
+    state.cart.reduce((sumAmount, product) => {
+      sumAmount[product.id] = product.amount;
+
+      return sumAmount;
+    }, {});
+  });
+
+  const dispatch = useDispatch();

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get('products');

      const data = response.data.map((product) => ({
        ...product,
        priceBRL: formatPriceBRL(product.price),
      }));

      setProducts(data);
    }

    loadProducts();
  }, []); // É passado um array vazio, para q execute só uma vez, como o componentDidMount

  /**
   * Essa função não poderia usar useCallback, pois ela não depende da mudança
   * de nenhum estado
   */
  function handleAddProduct(id) {
-    addToCartRequest(id);
+    dispatch(CartActions.addToCartRequest(id));
  }

  return (
    <ProductList>
      {products.map((product) => (
        <li key={product.id}>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{product.priceBRL}</span>

          <button
            type="button"
            onClick={() => {
              return handleAddProduct(product.id);
            }}
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

-const mapStateToProps = (state) => ({
-  // Quantidade daquele produto selecionado
-  amount: state.cart.reduce((amount, product) => {
-    amount[product.id] = product.amount;
-
-    return amount;
-  }, {}),
-});
-
-const mapDispatchToProps = (dispatch) =>
-  // Actions se tornam props
-  bindActionCreators(CartActions, dispatch);
-
-export default connect(mapStateToProps, -mapDispatchToProps)(Home);
-
-Home.propTypes = {
-  addToCartRequest: PropTypes.func.isRequired,
-};
```

## src/pages/Cart/index.js

```diff
import React from 'react';
-import { connect } from 'react-redux';
-import { bindActionCreators } from 'redux';
+import { useSelector, useDispatch } from 'react-redux';
import {
  MdRemoveCircleOutline,
  MdAddCircleOutline,
  MdDelete,
} from 'react-icons/md';

import * as CartActions from '../../store/modules/cart/actions';

import { formatPriceBRL } from '../../util/format';

import { Container, ProductTable, Total } from './styles';

-function Cart({ cart, total, removeFromCart, updateAmountRequest }) {
+export default function Cart() {
+  const dispatch = useDispatch();
+
+  const cart = useSelector((state) =>
+    state.cart.map((product) => ({
+      ...product,
+      subtotal: formatPriceBRL(product.price * product.amount),
+    }))
+  );
+
+  const total = useSelector((state) =>
+    formatPriceBRL(
+      state.cart.reduce((totalSum, product) => {
+        return totalSum + product.price * product.amount;
+      }, 0)
+    )
+  );

  function increment(product) {
-    updateAmountRequest(product.id, product.amount + 1);
+    dispatch(CartActions.updateAmountRequest(product.id, product.amount + 1));
  }

  function decrement(product) {
-    updateAmountRequest(product.id, product.amount - 1);
+    dispatch(CartActions.updateAmountRequest(product.id, product.amount - 1));

  }

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
                  <button type="button" onClick={() => decrement(product)}>
                    <MdRemoveCircleOutline size={20} color="#7159c1" />
                  </button>
                  <input type="number" readOnly value={product.amount} />
                  <button type="button" onClick={() => increment(product)}>
                    <MdAddCircleOutline size={20} color="#7159c1" />
                  </button>
                </div>
              </td>
              <td>
                <strong>{product.subtotal}</strong>
              </td>
              <td>
                <button type="button">
                  <MdDelete
                    size={20}
                    color="#7159c1"
-                    onClick={() => removeFromCart(product.id)}
+                    onClick={() =>
+                      dispatch(CartActions.removeFromCart(product.id))
+                    }
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
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
}

-const mapStateToProps = (state) => ({
-  cart: state.cart.map((product) => ({
-    ...product,
-    subtotal: formatPriceBRL(product.price * product.amount),
-  })),
-  total: formatPriceBRL(
-    state.cart.reduce((total, product) => {
-      return total + product.price * product.amount;
-    }, 0)
-  ),
-});
-
-const mapDispatchToProps = (dispatch) =>
-  // Actions se tornam props
-  bindActionCreators(CartActions, dispatch);
-
-export default connect(mapStateToProps, -mapDispatchToProps)(Cart);
```
