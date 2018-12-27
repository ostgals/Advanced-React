import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { CURRENT_USER_QUERY } from './CurrentUser';

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
      item {
        id
        title
        price
        image
        description
      }
    }
  }
`;

const updateLocalCart = (cache, payload) => {
  const query = CURRENT_USER_QUERY;
  const data = cache.readQuery({ query });
  const addCartItem = payload.data.addToCart;
  const cachedCartItem = data.me.cart.find(
    cartItem => cartItem.item.id === addCartItem.item.id
  );

  if (cachedCartItem) {
    if (!addCartItem.id) {
      cachedCartItem.quantity++;
    } else {
      cachedCartItem.quantity = addCartItem.quantity;
    }
  } else {
    data.me.cart.push(addCartItem);
  }
  cache.writeQuery({ query, data });
};

export default ({ item, children }) => (
  <Mutation
    mutation={ADD_TO_CART_MUTATION}
    variables={{ id: item.id }}
    optimisticResponse={{
      addToCart: {
        __typename: 'CartItem',
        id: '',
        quantity: 1,
        item: {
          __typename: 'Item',
          ...item,
        },
      },
    }}
    update={updateLocalCart}
  >
    {(addToCart, { loading, error }) => (
      <button disabled={loading} onClick={addToCart} type="button">
        {children}
      </button>
    )}
  </Mutation>
);
