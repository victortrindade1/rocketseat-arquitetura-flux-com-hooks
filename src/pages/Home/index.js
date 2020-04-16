import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MdAddShoppingCart } from 'react-icons/md';
import { formatPriceBRL } from '../../util/format';
import api from '../../services/api';

import { ProductList } from './styles';

class Home extends Component {
  state = {
    products: [],
  };

  async componentDidMount() {
    const response = await api.get('products');

    /*
    Formate o preço aqui. Não formate no render(), pois sempre q renderizar
    vai chamar a função.
    Fique atento! Analise bem se precisa usar uma função dentro do render!
    */
    const data = response.data.map((product) => ({
      ...product,
      priceBRL: formatPriceBRL(product.price),
    }));

    this.setState({ products: data });
  }

  handleAddProduct = (product) => {
    /*
    A partir do momento que vc usa o connect, vc passa a ter acesso à
    propriedade dispatch, q serve para disparar actions
    */
    const { dispatch } = this.props;

    dispatch({
      type: 'ADD_TO_CART',
      product,
    });
  };

  render() {
    // console.tron.log('hey');
    const { products } = this.state;

    return (
      <ProductList>
        {products.map((product) => (
          <li key={product.id}>
            <img src={product.image} alt={product.title} />
            <strong>{product.title}</strong>
            <span>{product.priceBRL}</span>

            <button
              type="button"
              onClick={() => this.handleAddProduct(product)}
            >
              <div>
                <MdAddShoppingCart size={16} color="#fff" />
              </div>

              <span>ADICIONAR AO CARRINHO</span>
            </button>
          </li>
        ))}
      </ProductList>
    );
  }
}

export default connect()(Home);

Home.propTypes = {
  dispatch: PropTypes.func.isRequired,
};
