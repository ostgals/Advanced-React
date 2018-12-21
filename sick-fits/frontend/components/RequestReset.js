import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

export default class RequestReset extends Component {
  state = { email: '' };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
        {(reset, { loading, error, called }) => (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await reset();
              this.setState({ email: '' });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset Password</h2>

              {error && <ErrorMessage error={error} />}

              {!loading && !error && called && (
                <p>Success! Check your inbox for a reset link!</p>
              )}

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </label>

              <button type="submit">Request Reset!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}
