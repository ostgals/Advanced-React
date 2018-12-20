import React, { Component } from 'react';

import CurrentUser from './CurrentUser';
import ErrorMessage from './ErrorMessage';

export default class Account extends Component {
  render() {
    return (
      <CurrentUser>
        {({ user, error }) => {
          if (error) return <ErrorMessage error={error} />;

          return (
            <div>
              <h2>My Account</h2>
              <pre>{JSON.stringify(user, 0, 2)}</pre>
            </div>
          );
        }}
      </CurrentUser>
    );
  }
}
