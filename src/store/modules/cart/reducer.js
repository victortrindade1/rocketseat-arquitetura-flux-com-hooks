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
    default:
      return state;
  }
}
