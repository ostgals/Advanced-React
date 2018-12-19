import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(id: $id) {
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION($data: ItemUpdateInput!, $id: ID!) {
    updateItem(data: $data, id: $id) {
      id
    }
  }
`;

class UpdateItem extends Component {
  state = {};

  handleChange = e => {
    const { name, type, value } = e.target;
    const fixedValue = type === 'number' ? +value : value;
    this.setState({ [name]: fixedValue });
  };

  handleSubmit = async (e, updateItem) => {
    e.preventDefault();
    const { data } = await updateItem();
    if (data) {
      Router.push({
        pathname: '/item',
        query: { id: data.updateItem.id },
      });
    }
  };

  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ loading, data }) => {
          if (loading) return <p>Loading...</p>;
          if (!data.item) return <p>No item found! (ID: {this.props.id})</p>;

          return (
            <Mutation
              mutation={UPDATE_ITEM_MUTATION}
              variables={{ data: this.state, id: this.props.id }}
            >
              {(updateItem, { loading, error }) => (
                <Form onSubmit={e => this.handleSubmit(e, updateItem)}>
                  <ErrorMessage error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        placeholder="Title"
                        defaultValue={data.item.title}
                        onChange={this.handleChange}
                      />
                    </label>

                    <label htmlFor="price">
                      Price
                      <input
                        type="number"
                        name="price"
                        id="price"
                        required
                        placeholder="Price in cents"
                        defaultValue={data.item.price}
                        onChange={this.handleChange}
                      />
                    </label>

                    <label htmlFor="description">
                      Description
                      <textarea
                        name="description"
                        id="description"
                        required
                        placeholder="Enter a desctiption"
                        defaultValue={data.item.description}
                        onChange={this.handleChange}
                      />
                    </label>

                    <button type="submit">Save Changes</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateItem;
