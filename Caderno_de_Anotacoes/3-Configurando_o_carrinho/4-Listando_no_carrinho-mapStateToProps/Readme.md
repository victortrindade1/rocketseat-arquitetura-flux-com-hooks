# Listando no carrinho

## src/pages/Cart/index.js

```diff
import React from 'react';
+ import { connect } from 'react-redux';
import {
  MdRemoveCircleOutline,
  MdAddCircleOutline,
  MdDelete,
} from 'react-icons/md';

import { Container, ProductTable, Total } from './styles';

- export default function Cart() {
+ function Cart({ cart }) {
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
+         {cart.map((product) => (
            <tr>
              <td>
-                <img
-                  src="https://img2.gratispng.com/20180701/haq/kisspng-nike-air-max-sneakers-nike-free-shoe-tenis-shoes-5b38f24d519077.2841344915304587013341.jpg"
-                  alt="Tênis"
-                />
+                <img src={product.image} alt={product.title} />
              </td>
              <td>
-                <strong>Tênis muito massa</strong>
+                <strong>{product.title}</strong>
-                <span>R$129,90</span>
+                <span>{product.priceBRL}</span>
              </td>
              <td>
                <div>
                  <button type="button">
                    <MdRemoveCircleOutline size={20} color="#7159c1" />
                  </button>
-                  <input type="number" readOnly value={2} />
+                  <input type="number" readOnly value={product.amount} />
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
                  <MdDelete size={20} color="#7159c1" />
                </button>
              </td>
            </tr>
+         ))}
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

+ const mapStateToProps = (state) => ({
+   cart: state.cart,
+ });
+
+ export default connect(mapStateToProps)(Cart);
```

## src/store/modules/cart/reducer.js

Vamos adicionar umas informações a mais no carrinho.

> Com o q foi feito aqui, sempre q adicionar ao carrinho vai criar uma nova
> linha e dizer q é qnt = 1, qnd o correto seria não duplicar item igual e
> incrementar na qnt qnd for item igual. Na próxima aula isto é consertado.

```diff
export default function cart(state = [], action) {
  switch (action.type) {
    case 'ADD_TO_CART':
-      return [...state, action.product];
+      return [
+        ...state,
+        {
+          ...action.product,
+          amount: 1,
+        },
+      ];
    default:
      return state;
  }
}
```
