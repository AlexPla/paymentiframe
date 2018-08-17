import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from '@Reducers';
import PaymentForm from '@Containers';
import './style/fonts.css';
import './style/index.css';

ReactDOM.render(
  <Provider store={createStore(reducers)}>
    <PaymentForm />
  </Provider>,
  document.getElementById('root'),
);
