import { StrictMode } from 'react';
import { render } from 'react-dom';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, from } from '@apollo/client';

import App from './App';

import { onError } from '@apollo/client/link/error';
import { toast } from 'react-toastify';

const httpLink = new HttpLink({
    uri: '/gql'
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
            const errMsg = `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`;
            toast.error(errMsg);
            console.error(errMsg);
        });
    }
    if (networkError && networkError.statusCode !== 401) {
        const errMsg = `[Network error]: ${networkError}`;
        toast.error(errMsg);
        console.error(errMsg);
    }
});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: from([errorLink, httpLink]),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
        mutate: {
            errorPolicy: 'all'
        }
    }
});

render((
    <StrictMode>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </StrictMode>
), document.getElementById('root'));
