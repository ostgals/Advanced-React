import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { CURRENT_USER_QUERY } from './CurrentUser';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $password: String!
    $name: String!
  ) {
    signup(email: $email, password: $password, name: $name) {
      id
    }
  }
`;

class Signup extends Component {
  state = {
    email: '',
    password: '',
    name: '',
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <Mutation
        mutation={SIGNUP_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signUp, { loading, error }) => (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              const res = await signUp();
              this.setState({ email: '', name: '', password: '' });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>New Account</h2>

              <ErrorMessage error={error} />

              <label htmlFor="email">
                Email
                <input
                  type="email"
                  name="email"
                  required
                  id="email"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </label>

              <label htmlFor="name">
                Name
                <input
                  type="text"
                  name="name"
                  required
                  id="name"
                  placeholder="Name"
                  value={this.state.name}
                  onChange={this.handleChange}
                />
              </label>

              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  required
                  id="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                />
              </label>

              <button type="submit">Sign Up!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Signup;
