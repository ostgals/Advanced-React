import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { uploadEndpoint, uploadPreset } from '../config';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION($data: ItemCreateInput!) {
    createItem(data: $data) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: '',
  };

  handleChange = e => {
    const { name, type, value } = e.target;
    const fixedValue = type === 'number' ? +value : value;
    this.setState({ [name]: fixedValue });
  };

  uploadFile = async e => {
    e.preventDefault();
    console.log('Uploading file...');

    const body = new FormData();

    body.append('file', e.target.files[0]);
    body.append('upload_preset', uploadPreset);

    const file = await fetch(uploadEndpoint, { method: 'POST', body }).then(
      res => res.json()
    );

    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    });
  };

  render() {
    return (
      <Mutation
        mutation={CREATE_ITEM_MUTATION}
        variables={{ data: this.state }}
      >
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async e => {
              e.preventDefault();
              const { data } = await createItem();
              if (data) {
                Router.push({
                  pathname: '/item',
                  query: { id: data.createItem.id },
                });
              }
            }}
          >
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
                  value={this.state.title}
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
                  value={this.state.price}
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
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </label>

              <label htmlFor="image">
                Image
                <input
                  type="file"
                  name="image"
                  id="image"
                  onChange={this.uploadFile}
                />
                {this.state.image && (
                  <img
                    src={this.state.image}
                    alt="Image Preview"
                    height={200}
                  />
                )}
              </label>

              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
