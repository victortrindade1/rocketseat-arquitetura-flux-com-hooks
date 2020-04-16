# Remover produto

## src/pages/Cart/index.js

```diff
import React from 'react';
import { connect } from 'react-redux';
import {
  MdRemoveCircleOutline,
  MdAddCircleOutline,
  MdDelete,
} from 'react-icons/md';

import { Container, ProductTable, Total } from './styles';

- function Cart({ cart }) {
+ function Cart({ cart, dispatch }) {
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
-                  <MdDelete size={20} color="#7159c1" />
+                  <MdDelete
+                    size={20}
+                    color="#7159c1"
+                    onClick={() =>
+                      dispatch({ type: 'REMOVE_FROM_CART', id: product.id })
+                    }
+                  />
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

export default connect(mapStateToProps)(Cart);
```

## src/store/modules/cart/reducer.js

```diff
import produce from 'immer';

export default function cart(state = [], action) {
  switch (action.type) {
    case 'ADD_TO_CART':
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
+    case 'REMOVE_FROM_CART':
+      return produce(state, (draft) => {
+        const productIndex = draft.findIndex((p) => p.id === action.id);
+
+        if (productIndex >= 0) {
+          draft.splice(productIndex, 1);
+        }
+      });
    default:
      return state;
  }
}
```
