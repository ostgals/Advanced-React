import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { CURRENT_USER_QUERY } from './CurrentUser';

const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT_MUTATION {
    signout {
      message
    }
  }
`;

export default () => (
  <Mutation
    mutation={SIGNOUT_MUTATION}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {(signOut, { loading }) => (
      <button
        disabled={loading}
        onClick={async () => {
          if (confirm('Ew.. Are you sure you want to sign out?')) {
            const res = await signOut();
            return;
          }
        }}
      >
        Sign Out
      </button>
    )}
  </Mutation>
);
