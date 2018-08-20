import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, compose } from 'redux';
import reducers from '@Reducers';
import PaymentForm from '@Containers';
import './style/fonts.css';
import './style/index.css';

const enhancers = compose(
  window.devToolsExtension && window.devToolsExtension(),
);

ReactDOM.render(
  <Provider store={createStore(reducers, {}, enhancers)}>
    <PaymentForm />
  </Provider>,
  document.getElementById('root'),
);
