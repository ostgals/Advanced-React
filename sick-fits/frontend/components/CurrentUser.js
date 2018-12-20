import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

export const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY {
    me {
      id
      email
      name
      permissions
    }
  }
`;

export default props => (
  <Query query={CURRENT_USER_QUERY}>
    {({ loading, data, error }) => {
      if (loading) return <p>Loading...</p>;
      return props.children({ user: data.me, error });
    }}
  </Query>
);
