import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { updateFields, updateErrors } from '@Actions';
import {
  CardHolderInput, CardNumberInput, CardExpDateInput, CardCVVInput, ZipCodeInput,
} from '@Components';
import { EventEmitterHelper } from '@Helpers';
import * as configs from '@Constants/configs';
import './PaymentForm.css';

const getParamValue = (paramName) => {
  const url = window.location.search.substring(1);
  const qArray = url.split('&');
  const param = qArray.find(element => (element.split('=')[0] === paramName));
  const value = param ? param.split('=')[1] : null;
  return value;
};

class PaymentForm extends Component {
  static defaultProps = {
    cardHolder: '',
    cardNumber: '',
    cardType: false,
    cardCVV: '',
    zipCode: '',
    cardExpirationMonth: '',
    cardExpirationYear: '',
    errors: {
      cardHolder: true,
      cardNumber: true,
      cardExpiration: true,
      cardCVV: true,
    },
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      parentApp: getParamValue('app') || configs.STOREFRONT,
      lang: getParamValue('lang') || configs.SPAIN,
    };

    this.showHelp = this.showHelp.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { errors: prevErrors } = prevProps;
    const { errors } = this.props;
    const { parentApp } = this.state;
    // Should only change if:
    // 1. one of the fields change from error -> success or vice versa.
    // 2. all fields are success and one of them changes of value (but keeps being success).
    if (JSON.stringify(prevErrors) !== JSON.stringify(errors)
      || Object.values(errors).every(value => !value)) {
      EventEmitterHelper.sendChangeEvent(parentApp, this.props);
    }
  }

  showHelp() {
    const { parentApp } = this.state;
    EventEmitterHelper.sendCvvEvent(parentApp);
  }

  render() {
    const {
      cardHolder,
      cardNumber,
      cardType,
      cardCVV,
      zipCode,
      cardExpirationMonth,
      cardExpirationYear,
      updateFields,
      updateErrors,
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
        <div className="grid grid_row">
          <div className="payment-form__item grid grid_column grid_size-6">
            <CardExpDateInput
              lang={lang}
              updateFields={updateFields}
              updateErrors={updateErrors}
              value={date}
            />
          </div>
          { lang === configs.MEXICO
            && (
              <div className="payment-form__item grid grid_column grid_size-6">
                <ZipCodeInput
                  updateFields={updateFields}
                  updateErrors={updateErrors}
                  value={zipCode}
                />
              </div>
            )
          }
        </div>
        <div className="payment-form__item grid grid_column grid_size-6">
          <CardCVVInput
            lang={lang}
            updateFields={updateFields}
            updateErrors={updateErrors}
            showHelp={this.showHelp}
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
      pattern: PropTypes.oneOfType([
        PropTypes.instanceOf(RegExp),
        PropTypes.string,
      ]).isRequired,
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
  zipCode: PropTypes.string,
  cardExpirationMonth: PropTypes.string,
  cardExpirationYear: PropTypes.string,
  errors: PropTypes.objectOf(PropTypes.bool),
  updateFields: PropTypes.func.isRequired,
  updateErrors: PropTypes.func.isRequired,
};

const mapStateToProps = ({ form }) => form || {};

const mapDispatchToProps = { updateFields, updateErrors };

export default connect(mapStateToProps, mapDispatchToProps)(PaymentForm);
