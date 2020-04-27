# Buscando produtos da API

## src/util

A pasta `util` possui funções q são usadas em vários locais da aplicação.

## src/util/format.js

O preço retornado do back-end vem em formato number. Para transformá-lo em moeda
do Brasil, o javascript possui uma função nativa para internacionalização
chamada `Intl`.

```javascript
export const { format: formatPriceBRL } = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});
```

## src/pages/Home/index.js

```diff
- import React from 'react';
+ import React, { Component } from 'react';

import { MdAddShoppingCart } from 'react-icons/md';
+ import { formatPriceBRL } from '../../util/format';
+ import api from '../../services/api';

import { ProductList } from './styles';

-export default function Home() {
-  return (
-    <ProductList>
-      <li>
-        <img
-          src="https://img2.gratispng.com/20180701/haq/kisspng-nike-air-max-sneakers-nike-free-shoe-tenis-shoes-5b38f24d519077.2841344915304587013341.jpg"
-          alt="Tênis"
-        />
-        <strong>Tênis muito legal</strong>
-        <span>R$129,90</span>
-
-        <button type="button">
-          <div>
-            <MdAddShoppingCart size={16} color="#fff" /> 3
-          </div>
-
-          <span>ADICIONAR AO CARRINHO</span>
-        </button>
-      </li>
-    </ProductList>
-  );
-}
+ export default class Home extends Component {
+   state = {
+     products: [],
+   };
+
+   async componentDidMount() {
+     const response = await api.get('products');
+
+     /*
+     Formate o preço aqui. Não formate no render(), pois sempre q renderizar
+     vai chamar a função.
+     Fique atento! Analise bem se precisa usar uma função dentro do render!
+     */
+     const data = response.data.map((product) => ({
+       ...product,
+       priceBRL: formatPriceBRL(product.price),
+     }));
+
+     this.setState({ products: data });
+   }
+
+   render() {
+     const { products } = this.state;
+
+     return (
+       <ProductList>
+         {products.map((product) => (
+           <li key={product.id}>
+             <img src={product.image} alt={product.title} />
+             <strong>{product.title}</strong>
+             <span>{product.priceBRL}</span>
+
+             <button type="button">
+               <div>
+                 <MdAddShoppingCart size={16} color="#fff" /> 3
+               </div>
+
+               <span>ADICIONAR AO CARRINHO</span>
+             </button>
+           </li>
+         ))}
+       </ProductList>
+     );
+   }
+ }
```
