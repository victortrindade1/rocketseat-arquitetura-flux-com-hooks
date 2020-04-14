# Estilizando Home

## Lib polished

Essa lib facilita a manipular cores. Em vez de abrirmos um programa e criarmos
cores hexadecimal, podemos por exemplo, dizer q quer 10% mais claro, ou escuro,
sem nem saber q cor hexadecimal é. Deixa mais rápido a criação.

`yarn add polished`

Exemplo de uso:

```javascript
import { darken } from 'polished';

export const Foobar = styled.div`
  background: ${darken(0.1, '#7159c1')};
`;
```

## src/pages/Home/index.js

```javascript
import React from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';

export default function Home() {
  return (
    <ProductList>
      <li>
        <img
          src="https://img2.gratispng.com/20180701/haq/kisspng-nike-air-max-sneakers-nike-free-shoe-tenis-shoes-5b38f24d519077.2841344915304587013341.jpg"
          alt="Tênis"
        />
        <strong>Tênis muito legal</strong>
        <span>R$129,90</span>

        <button type="button">
          <div>
            <MdAddShoppingCart size={16} color="#fff" /> 3
          </div>

          <span>ADICIONAR AO CARRINHO</span>
        </button>
      </li>

      <li>
        <img
          src="https://img2.gratispng.com/20180701/haq/kisspng-nike-air-max-sneakers-nike-free-shoe-tenis-shoes-5b38f24d519077.2841344915304587013341.jpg"
          alt="Tênis"
        />
        <strong>Tênis muito legal</strong>
        <span>R$129,90</span>

        <button type="button">
          <div>
            <MdAddShoppingCart size={16} color="#fff" /> 3
          </div>

          <span>ADICIONAR AO CARRINHO</span>
        </button>
      </li>

      <li>
        <img
          src="https://img2.gratispng.com/20180701/haq/kisspng-nike-air-max-sneakers-nike-free-shoe-tenis-shoes-5b38f24d519077.2841344915304587013341.jpg"
          alt="Tênis"
        />
        <strong>Tênis muito legal</strong>
        <span>R$129,90</span>

        <button type="button">
          <div>
            <MdAddShoppingCart size={16} color="#fff" /> 3
          </div>

          <span>ADICIONAR AO CARRINHO</span>
        </button>
      </li>

      <li>
        <img
          src="https://img2.gratispng.com/20180701/haq/kisspng-nike-air-max-sneakers-nike-free-shoe-tenis-shoes-5b38f24d519077.2841344915304587013341.jpg"
          alt="Tênis"
        />
        <strong>Tênis muito legal</strong>
        <span>R$129,90</span>

        <button type="button">
          <div>
            <MdAddShoppingCart size={16} color="#fff" /> 3
          </div>

          <span>ADICIONAR AO CARRINHO</span>
        </button>
      </li>

      <li>
        <img
          src="https://img2.gratispng.com/20180701/haq/kisspng-nike-air-max-sneakers-nike-free-shoe-tenis-shoes-5b38f24d519077.2841344915304587013341.jpg"
          alt="Tênis"
        />
        <strong>Tênis muito legal</strong>
        <span>R$129,90</span>

        <button type="button">
          <div>
            <MdAddShoppingCart size={16} color="#fff" /> 3
          </div>

          <span>ADICIONAR AO CARRINHO</span>
        </button>
      </li>

      <li>
        <img
          src="https://img2.gratispng.com/20180701/haq/kisspng-nike-air-max-sneakers-nike-free-shoe-tenis-shoes-5b38f24d519077.2841344915304587013341.jpg"
          alt="Tênis"
        />
        <strong>Tênis muito legal</strong>
        <span>R$129,90</span>

        <button type="button">
          <div>
            <MdAddShoppingCart size={16} color="#fff" /> 3
          </div>

          <span>ADICIONAR AO CARRINHO</span>
        </button>
      </li>

      <li>
        <img
          src="https://img2.gratispng.com/20180701/haq/kisspng-nike-air-max-sneakers-nike-free-shoe-tenis-shoes-5b38f24d519077.2841344915304587013341.jpg"
          alt="Tênis"
        />
        <strong>Tênis muito legal</strong>
        <span>R$129,90</span>

        <button type="button">
          <div>
            <MdAddShoppingCart size={16} color="#fff" /> 3
          </div>

          <span>ADICIONAR AO CARRINHO</span>
        </button>
      </li>

      <li>
        <img
          src="https://img2.gratispng.com/20180701/haq/kisspng-nike-air-max-sneakers-nike-free-shoe-tenis-shoes-5b38f24d519077.2841344915304587013341.jpg"
          alt="Tênis"
        />
        <strong>Tênis muito legal</strong>
        <span>R$129,90</span>

        <button type="button">
          <div>
            <MdAddShoppingCart size={16} color="#fff" /> 3
          </div>

          <span>ADICIONAR AO CARRINHO</span>
        </button>
      </li>
    </ProductList>
  );
}
```

## src/pages/Home/styles.js

```javascript
import styled from 'styled-components';
import { darken } from 'polished';

export const ProductList = styled.ul`
  display: grid;
  /* fr é pra largura exatamente igual */
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  list-style: none;

  li {
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 4px;
    padding: 20px;

    img {
      align-self: center;
      max-width: 250px;
    }

    /*
    O sinal de > é pra especificar q só quero q estilize a tag <strong> de
    dentro de <li>, e não todas as <strong>
    */
    > strong {
      font-size: 16px;
      line-height: 20px;
      color: #333;
      margin-top: 5px;
    }

    > span {
      font-size: 21px;
      font-weight: bold;
      margin: 5px 0 20px;
    }

    button {
      background: #7159c1;
      color: #fff;
      border: 0;
      border-radius: 4px;
      overflow: hidden;
      /**
      O "margin-top: auto" é mt bom pra alinhar em grid. Ele faz ocupar toda a
      margem top possível. Se por exemplo, um item tem título com mais linhas,
      ele alinha igual todos independente.
       */
      margin-top: auto;

      display: flex;
      align-items: center;
      transition: background 0.2s;

      &:hover {
        /* 10% mais escuro  */
        background: ${darken(0.1, '#7159c1')};
      }

      div {
        display: flex;
        align-items: center;
        padding: 12px;
        background: rgba(0, 0, 0, 0.1);

        svg {
          margin-right: 5px;
        }
      }

      span {
        flex: 1;
        text-a
      }
    }
  }
`;
```
