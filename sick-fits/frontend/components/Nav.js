import React from 'react';
import Link from 'next/link';

import NavStyles from './styles/NavStyles';
import User from './CurrentUser';
import Signout from './Signout';
import CartToggle from './mutations/CartToggle';

export default () => (
  <User>
    {({ user }) => (
      <NavStyles>
        <Link href="/items">
          <a>Shop</a>
        </Link>
        {user ? (
          <>
            <Link href="/sell">
              <a>Sell</a>
            </Link>
            <Link href="/orders">
              <a>Orders</a>
            </Link>
            <Link href="/me">
              <a>Account</a>
            </Link>
            <Signout />
            <CartToggle>
              {({ toggleCart }) => (
                <button onClick={() => toggleCart(true)}>My Cart</button>
              )}
            </CartToggle>
          </>
        ) : (
          <Link href="/signup">
            <a>Sign In</a>
          </Link>
        )}
      </NavStyles>
    )}
  </User>
);
