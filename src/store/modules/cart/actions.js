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
