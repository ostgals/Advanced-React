import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { ALL_ITEMS_QUERY } from './Items';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

export default class DeleteItem extends Component {
  updateCache = (cache, payload) => {
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    data.items = data.items.filter(
      item => item.id !== payload.data.deleteItem.id
    );
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  };

  handleClick = (e, deleteItem) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this item?')) {
      deleteItem();
    }
  };

  render() {
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id: this.props.id }}
        update={this.updateCache}
      >
        {(deleteItem, { loading, data }) => (
          <button
            disabled={loading}
            onClick={e => this.handleClick(e, deleteItem)}
          >
            {this.props.children}
          </button>
        )}
      </Mutation>
    );
  }
}
