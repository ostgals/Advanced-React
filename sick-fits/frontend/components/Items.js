import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';

import Item from './Item';
import Pagination from './Pagination';
import { perPage } from '../config';

export const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY($skip: Int, $first: Int) {
    items(skip: $skip, first: $first) {
      id
      title
      description
      image
      largeImage
      price
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;

const ItemList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
`;

class Items extends Component {
  render() {
    const { page } = this.props;
    return (
      <Center>
        <Pagination page={page} />
        <Query
          query={ALL_ITEMS_QUERY}
          variables={{ skip: (page - 1) * perPage, first: perPage }}
        >
          {({ loading, data, error }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>{error.message}</p>;

            return (
              <ItemList>
                {data.items.map(item => (
                  <Item key={item.id} item={item} />
                ))}
              </ItemList>
            );
          }}
        </Query>
        <Pagination page={page} />
      </Center>
    );
  }
}

export default Items;
