import App, { Container } from 'next/app';
import { ApolloProvider } from 'react-apollo';

import withData from '../lib/withData';
import Page from '../components/Page';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let componentProps = {};
    if (Component.getInitialProps) {
      componentProps = await Component.getInitialProps(ctx);
    }
    componentProps.query = ctx.query;
    return { componentProps };
  }

  render() {
    const { Component, apollo: client, componentProps } = this.props;

    return (
      <Container>
        <ApolloProvider client={client}>
          <Page>
            <Component {...componentProps} />
          </Page>
        </ApolloProvider>
      </Container>
    );
  }
}

export default withData(MyApp);
