import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Head from 'next/head';
import Link from 'next/link';

import PaginationStyles from './styles/PaginationStyles';
import { perPage } from '../config';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

export default ({ page }) => (
  <Query query={PAGINATION_QUERY}>
    {({ loading, data, error }) => {
      if (loading || error) return null;

      const { count } = data.itemsConnection.aggregate;
      const pages = Math.ceil(count / perPage);

      return (
        <PaginationStyles>
          <Head>
            <title>
              Sick Fits! Page {page} of {pages}
            </title>
          </Head>
          <Link
            prefetch
            href={{ pathname: 'items', query: { page: page - 1 } }}
          >
            <a className="prev" aria-disabled={page <= 1}>
              &laquo; Prev
            </a>
          </Link>
          <p>
            {page} of {pages}
          </p>
          <p>{count} Items Total</p>
          <Link
            prefetch
            href={{ pathname: 'items', query: { page: page + 1 } }}
          >
            <a className="prev" aria-disabled={page >= pages}>
              Next &raquo;
            </a>
          </Link>
        </PaginationStyles>
      );
    }}
  </Query>
);
