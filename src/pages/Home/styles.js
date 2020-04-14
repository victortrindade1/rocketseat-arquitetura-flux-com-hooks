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
