import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const CART_OPEN_QUERY = gql`
  {
    cartOpen @client
  }
`;

export default props => (
  <Query query={CART_OPEN_QUERY}>
    {({ data: { cartOpen }, client }) => {
      return props.children({
        cartOpen,
        toggleCart: yn => client.writeData({ data: { cartOpen: yn } }),
      });
    }}
  </Query>
);
