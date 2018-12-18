import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Form from './styles/Form';

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
  render() {
    return (
      <Form onSubmit={e => e.preventDefault()}>
        <fieldset>
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
              placeholder="Enter a desctiption"
              value={this.state.description}
              onChange={this.handleChange}
            />
          </label>

          <button type="submit">Submit</button>
        </fieldset>
      </Form>
    );
  }
}

export default CreateItem;
