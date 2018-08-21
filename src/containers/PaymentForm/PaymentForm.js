import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { updateFields, updateErrors, showHelp } from '@Actions';
import {
  CardHolderInput, CardNumberInput, CardExpDateInput, CardCVVInput,
} from '@Components';
import './PaymentForm.css';

const getParamValue = (paramName) => {
  const url = window.location.search.substring(1);
  const qArray = url.split('&');
  const param = qArray.find(element => (element.split('=')[0] === paramName));
  return param ? param[1] : null;
};

class PaymentForm extends Component {
  static defaultProps = {
    cardHolder: '',
    cardNumber: '',
    cardType: false,
    cardCVV: '',
    cardExpirationMonth: '',
    cardExpirationYear: '',
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      parentApp: getParamValue('app') || 'storefront',
      lang: getParamValue('lang') || 'es',
    };
  }

  render() {
    const {
      cardHolder,
      cardNumber,
      cardType,
      cardCVV,
      cardExpirationMonth,
      cardExpirationYear,
      updateFields,
      updateErrors,
      showHelp,
    } = this.props;
    const { parentApp, lang } = this.state;
    const date = {
      month: cardExpirationMonth,
      year: cardExpirationYear,
    };
    return (
      <div className="PaymentForm">
        <header className="PaymentForm-header">
          <h1 className="PaymentForm-title">
            { parentApp }
          </h1>
        </header>
        <div className="payment-form__item grid grid_column grid_size-12">
          <CardHolderInput
            lang={lang}
            updateFields={updateFields}
            updateErrors={updateErrors}
            value={cardHolder}
          />
        </div>
        <div className="payment-form__item grid grid_column grid_size-12">
          <CardNumberInput
            lang={lang}
            updateFields={updateFields}
            updateErrors={updateErrors}
            value={cardNumber}
            cardType={cardType}
          />
        </div>
        <div className="payment-form__item grid grid_column grid_size-12">
          <CardExpDateInput
            lang={lang}
            updateFields={updateFields}
            updateErrors={updateErrors}
            value={date}
          />
        </div>
        <div className="payment-form__item grid grid_column grid_size-6">
          <CardCVVInput
            lang={lang}
            updateFields={updateFields}
            updateErrors={updateErrors}
            showHelp={showHelp}
            value={cardCVV}
            cardType={cardType}
          />
        </div>
      </div>
    );
  }
}

PaymentForm.propTypes = {
  cardHolder: PropTypes.string,
  cardNumber: PropTypes.string,
  cardType: PropTypes.oneOfType([
    PropTypes.shape({
      niceType: PropTypes.string,
      type: PropTypes.string.isRequired,
      pattern: PropTypes.string.isRequired,
      gaps: PropTypes.arrayOf(PropTypes.number).isRequired,
      lengths: PropTypes.arrayOf(PropTypes.number).isRequired,
      code: PropTypes.shape({
        name: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired,
      }),
    }),
    PropTypes.bool,
  ]),
  cardCVV: PropTypes.string,
  cardExpirationMonth: PropTypes.string,
  cardExpirationYear: PropTypes.string,
  updateFields: PropTypes.func.isRequired,
  updateErrors: PropTypes.func.isRequired,
  showHelp: PropTypes.func.isRequired,
};

const mapStateToProps = ({ form }) => form || {};

const mapDispatchToProps = { updateFields, updateErrors, showHelp };

export default connect(mapStateToProps, mapDispatchToProps)(PaymentForm);
