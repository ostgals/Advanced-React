import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';

import { CURRENT_USER_QUERY } from './CurrentUser';

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
  }
  cursor: pointer;
`;

const updateLocalCart = (cache, payload) => {
  const query = CURRENT_USER_QUERY;
  const data = cache.readQuery({ query });
  const removeId = payload.data.removeFromCart.id;
  data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== removeId);
  cache.writeQuery({ query, data });
};

export default ({ id, children }) => (
  <Mutation
    mutation={REMOVE_FROM_CART_MUTATION}
    variables={{ id }}
    update={updateLocalCart}
    optimisticResponse={{
      removeFromCart: { __typename: 'CartItem', id },
    }}
  >
    {(removeFromCart, { loading, error }) => (
      <BigButton disabled={loading} onClick={removeFromCart}>
        {children || 'Remove From Cart'}
      </BigButton>
    )}
  </Mutation>
);
