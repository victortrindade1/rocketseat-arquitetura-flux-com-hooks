# Produto duplicado

## Immer - editando o Store

O Redux possui o conceito da imutabilidade. Isto quer dizer que se no state
existe um valor definido num objeto ou array, este valor não pode mudar. Vc deve criar um novo valor e usar o novo. O q o `Immer` faz é dar a liberdade de vc
editar um valor dentro do store, ou seja, ele traz a edição em algo q não daria
para editar. Na prática, o q ele faz é criar um novo state com o q vc editou, e
sobrescrever o antigo.

`yarn add immer`

## src/store/modules/cart/reducer.js

O q eu quero:

- Qnd o usuário clica no produto igual, incrementa amount + 1 no store em vez
  de criar um newAmount no store.
- Qnd o usuário clica pela primeira vez no produto, cria um amount = 1

> Mais pra frente, qnd vc ver o Redux Saga, vc verá q esse algoritmo no reducer cheio de drafts horríveis, some tudo. Fica super limpo só com um draft.push, e todo o resto faz no saga com código normal sem draft. Então não se desespere. Se usar Saga, não precisa criar as coisas no reducer.

```diff
+ import produce from 'immer';

export default function cart(state = [], action) {
  switch (action.type) {
    case 'ADD_TO_CART':
-      return [
-        ...state,
-        {
-          ...action.product,
-          amount: 1,
-        },
-      ];
+      return produce(state, (draft) => {
+        // Procura se já existe o produto
+        const productIndex = draft.findIndex((p) => p.id === action.product.id);
+
+        if (productIndex >= 0) {
+          draft[productIndex].amount += 1;
+        } else {
+          // Ainda não existe o produto
+          draft.push({
+            ...action.product,
+            amount: 1,
+          });
+        }
+      });
    default:
      return state;
  }
}
```

## .eslintrc.js

```diff
  rules: {
    'prettier/prettier': 'error',
    'react/jsx-filename-extension': ['warn', { extensions: ['.jsx', '.js'] }],
    'import/prefer-default-export': 'off',
    'react/state-in-constructor': ['off', 'always'],
    'no-console': ['error', { allow: ['tron'] }],
+    'no-param-reassign': 'off',
  },
```
