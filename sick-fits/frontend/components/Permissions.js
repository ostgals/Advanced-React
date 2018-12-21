import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import styled from 'styled-components';

import ErrorMessage from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
];

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    users {
      id
      name
      email
      permissions
    }
  }
`;

export default props => (
  <Query query={ALL_USERS_QUERY}>
    {({ loading, data, error }) => {
      if (loading && !data.users) return <p>Loading...</p>;
      if (error) return <ErrorMessage error={error} />;

      return (
        <div>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {possiblePermissions.map(perm => (
                  <th key={perm}>{perm}</th>
                ))}
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {data.users.map(user => (
                <UserPermissions key={user.id} user={user} />
              ))}
            </tbody>
          </Table>
        </div>
      );
    }}
  </Query>
);

const BigLabel = styled.label`
  display: block;
`;

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION(
    $userId: ID!
    $permissions: [Permission]!
  ) {
    updatePermissions(userId: $userId, permissions: $permissions) {
      id
      email
      name
      permissions
    }
  }
`;

class UserPermissions extends React.Component {
  state = { permissions: this.props.user.permissions };

  handlePermissionChange = e => {
    const { value, checked } = e.target;
    let permissions = [...this.state.permissions];
    if (checked) {
      permissions.push(value);
    } else {
      permissions = permissions.filter(perm => perm !== value);
    }
    this.setState({ permissions });
  };

  render() {
    const { user } = this.props;
    return (
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {possiblePermissions.map(permission => (
          <td key={permission}>
            <BigLabel htmlFor={`${user.id}-permission-${permission}`}>
              <input
                id={`${user.id}-permission-${permission}`}
                type="checkbox"
                checked={this.state.permissions.includes(permission)}
                value={permission}
                onChange={this.handlePermissionChange}
              />
            </BigLabel>
          </td>
        ))}
        <td>
          <Mutation
            mutation={UPDATE_PERMISSIONS_MUTATION}
            variables={{
              userId: user.id,
              permissions: this.state.permissions,
            }}
          >
            {(updatePermissions, { loading, error }) => (
              <SickButton
                type="button"
                disabled={loading}
                onClick={updatePermissions}
              >
                Updat{loading ? 'ing' : 'e'}
              </SickButton>
            )}
          </Mutation>
        </td>
      </tr>
    );
  }
}
