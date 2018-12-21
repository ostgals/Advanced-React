import React from 'react';
import { Query } from 'react-apollo';

import { CURRENT_USER_QUERY } from './CurrentUser';
import Signin from './Signin';

export default props => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading }) => {
      if (loading) return <p>Loading...</p>;

      if (!data.me) {
        return (
          <div>
            <p>Please sign in before continuing!</p>
            <Signin />
          </div>
        );
      } else {
        return <div>{props.children}</div>;
      }
    }}
  </Query>
);
