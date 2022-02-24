import { StrictMode } from 'react';
import { render } from 'react-dom';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { toast } from 'react-toastify';

import App from './App';

// Favicon imports
import './favicon/android-chrome-192x192.png';
import './favicon/android-chrome-512x512.png';
import './favicon/apple-touch-icon.png';
import './favicon/browserconfig.xml';
import './favicon/favicon-16x16.png';
import './favicon/favicon-32x32.png';
import './favicon/favicon.ico';
import './favicon/mstile-70x70.png';
import './favicon/mstile-144x144.png';
import './favicon/mstile-150x150.png';
import './favicon/mstile-310x150.png';
import './favicon/mstile-310x310.png';
import './favicon/safari-pinned-tab.svg';
import './favicon/site.webmanifest';

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
