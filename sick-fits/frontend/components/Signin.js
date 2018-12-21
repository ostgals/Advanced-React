import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { CURRENT_USER_QUERY } from './CurrentUser';

const SIGNIN_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
    }
  }
`;

class Signin extends Component {
  state = {
    email: '',
    password: '',
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signIn, { loading, error }) => (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              const res = await signIn();
              this.setState({ email: '', password: '' });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign In</h2>

              <ErrorMessage error={error} />

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email"
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  name="password"
                  required
                  value={this.state.password}
                  onChange={this.handleChange}
                />
              </label>

              <button type="submit">Sign In!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Signin;
