import React, { Component } from 'react';
import './PaymentForm.css';
import CardNumberInput from '../CardNumberInput/CardNumberInput';

const getParamValue = (paramName) => {
  var url = window.location.search.substring(1);
  var qArray = url.split('&');
  for (var i = 0; i < qArray.length; i++) {
    var pArr = qArray[i].split('=');
    if (pArr[0] === paramName) return pArr[1];
  }
}

class PaymentForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      parentApp: getParamValue('app') || 'storefront',
      lang: getParamValue('lang') || 'es'
    };
  }

  render() {
    const { parentApp } = this.state;
    return (
      <div className = 'PaymentForm'>
        <header className = 'PaymentForm-header'>
          <h1 className = 'PaymentForm-title'>
            { parentApp }
          </h1>
        </header>
        <div className = 'payment-form__item grid grid_column grid_size-12'>
          <CardNumberInput lang = { this.state.lang } ></CardNumberInput>
        </div>
      </div>
    );
  }
}

export default PaymentForm;
