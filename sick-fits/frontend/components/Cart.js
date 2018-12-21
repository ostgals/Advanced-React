import React from 'react';

import CartToggle from './mutations/CartToggle';
import CartStyles from './styles/CartStyles';
import CloseButton from './styles/CloseButton';
import Supreme from './styles/Supreme';
import SickButton from './styles/SickButton';

export default props => (
  <CartToggle>
    {({ cartOpen, toggleCart }) => (
      <CartStyles open={cartOpen}>
        <header>
          <CloseButton title="close" onClick={() => toggleCart(false)}>
            &times;
          </CloseButton>
          <Supreme>Your Cart</Supreme>
          <p>You have _ items in the cart.</p>
        </header>

        <footer>
          <p>$1,024.00</p>
          <SickButton>Checkout</SickButton>
        </footer>
      </CartStyles>
    )}
  </CartToggle>
);
