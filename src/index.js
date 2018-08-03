import React from 'react';
import ReactDOM from 'react-dom';
import './style/fonts.css';
import './style/index.css';
import PaymentForm from './components/PaymentForm/PaymentForm';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<PaymentForm />, document.getElementById('root'));
registerServiceWorker();
