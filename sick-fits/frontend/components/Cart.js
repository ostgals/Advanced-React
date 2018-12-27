import React from 'react';

import CurrentUser from './CurrentUser';
import CartToggle from './mutations/CartToggle';
import CartStyles from './styles/CartStyles';
import CloseButton from './styles/CloseButton';
import Supreme from './styles/Supreme';
import SickButton from './styles/SickButton';
import CartItem from './CartItem';
import formatMoney from '../lib/formatMoney';
import calcTotalPrice from '../lib/calcTotalPrice';

export default props => (
  <CurrentUser>
    {({ user }) =>
      user && (
        <CartToggle>
          {({ cartOpen, toggleCart }) => (
            <CartStyles open={cartOpen}>
              <header>
                <CloseButton title="close" onClick={() => toggleCart(false)}>
                  &times;
                </CloseButton>
                <Supreme>{user.name}'s Cart</Supreme>
                <p>
                  You have {user.cart.length} item{user.cart.length > 1 && 's'}{' '}
                  in the cart.
                </p>
              </header>

              <ul>
                {user.cart.map(cartItem => (
                  <CartItem key={cartItem.id} cartItem={cartItem} />
                ))}
              </ul>

              <footer>
                <p>{formatMoney(calcTotalPrice(user.cart))}</p>
                <SickButton>Checkout</SickButton>
              </footer>
            </CartStyles>
          )}
        </CartToggle>
      )
    }
  </CurrentUser>
);
