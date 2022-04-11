import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider
} from "@apollo/client";
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import allReducers from './redux-reducers';
import actions from './redux-actions';

export const client = new ApolloClient({
    uri: 'http://localhost:4000/',
    cache: new InMemoryCache()
});

export const store = createStore(
    allReducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// store.dispatch(actions.changeCat("all"));

ReactDOM.render(
    <ApolloProvider client={client}>
        <Provider store={store}>
            <React.StrictMode>
                <App />
            </React.StrictMode>
        </Provider>
    </ApolloProvider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
