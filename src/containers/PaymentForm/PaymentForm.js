import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { updateFields, updateErrors } from '@Actions';
import {
  CardHolderInput, CardNumberInput, CardExpDateInput, CardCVVInput, ZipCodeInput,
} from '@Components';
import { EventEmitterHelper } from '@Helpers';
import * as configs from '@Constants/configs';
import * as cardConstants from '@Constants/creditCard';
import './PaymentForm.css';

const getParamValue = (paramName) => {
  const url = window.location.search.substring(1);
  const qArray = url.split('&');
  const param = qArray.find(element => (element.split('=')[0] === paramName));
  const value = param ? param.split('=')[1] : null;
  return value;
};

const getEnv = () => {
  const url = window.location.href;
  return url.indexOf('test') === -1 && url.indexOf('localhost') === -1;
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
      prod: getEnv(),
    };
  }

  // Need to send event with height of a form
  componentDidMount() {
    const { prod } = this.state;
    EventEmitterHelper.sendHeightEvent(document.body.scrollHeight);
    EventEmitterHelper.sendChangeEvent(prod, this.props);
  }

  componentDidUpdate(prevProps) {
    const { errors: prevErrors } = prevProps;
    const { errors } = this.props;
    const { prod } = this.state;
    // Should only change if:
    // 1. one of the fields change from error -> success or vice versa.
    // 2. all fields are success and one of them changes of value (but keeps being success).
    if (JSON.stringify(prevErrors) !== JSON.stringify(errors)
      || Object.values(errors).every(value => !value)) {
      EventEmitterHelper.sendChangeEvent(prod, this.props);
    }
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
      <div className={`payment-form payment-form__${parentApp}`}>
        <div className="grid grid_column grid_size-12">
          <CardHolderInput
            parentApp={parentApp}
            lang={lang}
            updateFields={updateFields}
            updateErrors={updateErrors}
            value={cardHolder}
          />
        </div>
        <div className="grid grid_column grid_size-12">
          <CardNumberInput
            parentApp={parentApp}
            lang={lang}
            updateFields={updateFields}
            updateErrors={updateErrors}
            value={cardNumber}
            cardType={cardType}
          />
        </div>
        <div className="grid grid_row">
          <div className="grid grid_column grid_size-6">
            <CardExpDateInput
              parentApp={parentApp}
              lang={lang}
              updateFields={updateFields}
              updateErrors={updateErrors}
              value={date}
            />
          </div>
          { lang === configs.MEXICO && cardType.type === cardConstants.AMERICAN_EXPRESS
            && (
              <div className="grid grid_column grid_size-6">
                <ZipCodeInput
                  parentApp={parentApp}
                  updateFields={updateFields}
                  updateErrors={updateErrors}
                  value={zipCode}
                />
              </div>
            )
          }
        </div>
        <div className="grid grid_column grid_size-6">
          <CardCVVInput
            parentApp={parentApp}
            lang={lang}
            updateFields={updateFields}
            updateErrors={updateErrors}
            showHelp={EventEmitterHelper.sendCvvEvent}
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
