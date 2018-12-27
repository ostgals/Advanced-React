import React from 'react';
import styled from 'styled-components';

import formatMoney from '../lib/formatMoney';
import RemoveFromCart from './RemoveFromCart';

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.lightgrey};
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  img {
    margin-right: 10px;
  }
  h3 {
    margin: 0;
  }
`;

export default ({ cartItem }) => (
  <CartItemStyles>
    <img width={100} src={cartItem.item.image} alt={cartItem.item.title} />
    <div className="cart-item-details">
      <h3>{cartItem.item.title}</h3>
      <p>
        {formatMoney(cartItem.item.price * cartItem.quantity)}
        <em>
          {' - '}
          {cartItem.quantity} &times;
          {formatMoney(cartItem.item.price)}
        </em>
      </p>
    </div>
    <RemoveFromCart id={cartItem.id}>&times;</RemoveFromCart>
  </CartItemStyles>
);
