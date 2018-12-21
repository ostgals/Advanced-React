import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { CURRENT_USER_QUERY } from './CurrentUser';

const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
    }
  }
`;

export default class RequestReset extends Component {
  state = { password: '', confirmPassword: '' };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const { resetToken } = this.props;
    return (
      <Mutation
        mutation={RESET_PASSWORD_MUTATION}
        variables={{ ...this.state, resetToken }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(reset, { loading, error, called }) => (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await reset();
              this.setState({ password: '', confirmPassword: '' });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset Password</h2>

              {error && <ErrorMessage error={error} />}

              {!loading && !error && called && (
                <p>Success! Your password has been reset!</p>
              )}

              <label>
                New Password
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  value={this.state.password}
                  onChange={this.handleChange}
                />
              </label>

              <label>
                Confirm Password
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  value={this.state.confirmPassword}
                  onChange={this.handleChange}
                />
              </label>

              <button type="submit">Reset Password!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}
