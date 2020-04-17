# Alterando quantidade

## src/store/modules/cart/actions.js

Vamos criar a action update amount

```diff
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

+ export function updateAmount(id, amount) {
+   return {
+     type: '@cart/UPDATE_AMOUNT',
+     id,
+     amount,
+   };
+ }
```

## src/pages/Cart/index.js

```diff
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  MdRemoveCircleOutline,
  MdAddCircleOutline,
  MdDelete,
} from 'react-icons/md';

import * as CartActions from '../../store/modules/cart/actions';

import { Container, ProductTable, Total } from './styles';

- function Cart({ cart, removeFromCart }) {
+ function Cart({ cart, removeFromCart, updateAmount }) {
+   function increment(product) {
+     updateAmount(product.id, product.amount + 1);
+   }
+
+   function decrement(product) {
+     updateAmount(product.id, product.amount - 1);
+   }

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
-                  <button type="button">
+                  <button type="button" onClick={() => decrement(product)}>
                    <MdRemoveCircleOutline size={20} color="#7159c1" />
                  </button>
                  <input type="number" readOnly value={product.amount} />
-                  <button type="button">
+                  <button type="button" onClick={() => increment(product)}>
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
                    onClick={() => removeFromCart(product.id)}
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

const mapDispatchToProps = (dispatch) =>
  // Actions se tornam props
  bindActionCreators(CartActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
```

## src/store/modules/cart/reducer.js

```diff
import produce from 'immer';

export default function cart(state = [], action) {
  switch (action.type) {
    case '@cart/ADD':
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
+    case '@cart/UPDATE_AMOUNT': {
+      if (action.amount <= 0) {
+        return state;
+      }
+
+      return produce(state, (draft) => {
+        const productIndex = draft.findIndex((p) => p.id === action.id);
+
+        if (productIndex >= 0) {
+          draft[productIndex].amount = Number(action.amount);
+        }
+      });
+    }
    default:
      return state;
  }
}
```
