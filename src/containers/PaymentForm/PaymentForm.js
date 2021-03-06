import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { initErrors, updateFields, updateErrors } from '@Actions';
import {
  CardHolderInput, CardNumberInput, CardExpDateInput, CardCVVInput, ZipCodeInput,
} from '@Components';
import { EventEmitterHelper } from '@Helpers';
import * as configs from '@Constants/configs';
import * as cardConstants from '@Constants/creditCard';
import cardCVVCopies from '@Copies/cardCVVInput';
import cardExpDateCopies from '@Copies/cardExpDateInput';
import cardHolderCopies from '@Copies/cardHolderInput';
import cardNumberCopies from '@Copies/cardNumberInput';
import zipCodeCopies from '@Copies/zipCodeInput';
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
  constructor(props, context) {
    super(props, context);

    this.expDateInput = React.createRef();
    this.zipCodeInput = React.createRef();
    this.cardCVVInput = React.createRef();

    this.state = {
      parentApp: getParamValue('app') || configs.STOREFRONT,
      lang: getParamValue('lang') || configs.SPAIN,
      prod: getEnv(),
    };
  }

  componentDidMount() {
    const { lang } = this.state;
    const { initErrors } = this.props;
    if (document.fonts) {
      // if tool is available, use it
      document.fonts.ready.then(this.sendHeightEvent);
    } else {
      // if not, set a timeout
      setTimeout(this.sendHeightEvent, 500);
    }
    // Set initial array of errors (all fields required in correct language)
    // It'll change app state so will enter componentDidUpdate and send first change event
    initErrors([
      {
        key: 'cardCVV',
        value: `${cardCVVCopies.errors.required[lang]}${cardConstants.CVV_TYPE_DEFAULT}.`,
      },
      {
        key: 'cardExpiration',
        value: cardExpDateCopies.errors.required[lang],
      },
      {
        key: 'cardHolder',
        value: cardHolderCopies.errors.required[lang],
      },
      {
        key: 'cardNumber',
        value: cardNumberCopies.errors.required[lang],
      },
    ]);
  }

  componentDidUpdate(prevProps) {
    const { cardType: prevCardType, errors: prevErrors } = prevProps;
    const { cardType, errors, updateErrors } = this.props;
    const { prod, lang } = this.state;
    if (lang === configs.MEXICO
      && cardType.type !== prevCardType.type
      && cardType.type === cardConstants.AMERICAN_EXPRESS) {
      const errorMessage = (this.prevZipError !== undefined)
        ? this.prevZipError
        : { key: 'zipCode', value: zipCodeCopies.errors.required };
      updateErrors(errorMessage);
    } else if (lang === configs.MEXICO
      && cardType.type !== prevCardType.type
      && prevCardType.type === cardConstants.AMERICAN_EXPRESS) {
      const valid = { key: 'zipCode', value: '' };
      this.prevZipError = errors.find(error => error.key === 'zipCode')
        || valid;
      updateErrors(valid);
    }
    if (errors.length === 0
      || JSON.stringify(prevErrors) !== JSON.stringify(errors)) {
      // Should only change if:
      // 1. one of the fields change from error -> valid or vice versa.
      // 2. all fields are valid and one of their value's change (but keeps being valid).
      // 3. one of the fields error changes to a different error.
      EventEmitterHelper.sendChangeEvent(prod, this.props);
    }
  }

  focusExpDate = () => {
    this.expDateInput.current.expDateInput.current.focus();
  }

  focusExpDatesNext = () => {
    const { lang } = this.state;
    const { cardType } = this.props;
    if (lang === configs.MEXICO && cardType.type === cardConstants.AMERICAN_EXPRESS) {
      this.zipCodeInput.current.zipCodeInput.current.focus();
    } else {
      this.cardCVVInput.current.cardCVVInput.current.focus();
    }
  }

  sendHeightEvent = () => {
    /* istanbul ignore next */
    const height = (document.body.scrollHeight > 0)
      ? document.body.scrollHeight
      : 327;
    EventEmitterHelper.sendHeightEvent(height);
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
            focusExpDate={this.focusExpDate}
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
              focusExpDatesNext={this.focusExpDatesNext}
              value={date}
              ref={this.expDateInput}
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
                  ref={this.zipCodeInput}
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
            ref={this.cardCVVInput}
          />
        </div>
      </div>
    );
  }
}

PaymentForm.propTypes = {
  cardHolder: PropTypes.string.isRequired,
  cardNumber: PropTypes.string.isRequired,
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
  ]).isRequired,
  cardCVV: PropTypes.string.isRequired,
  zipCode: PropTypes.string.isRequired,
  cardExpirationMonth: PropTypes.string.isRequired,
  cardExpirationYear: PropTypes.string.isRequired,
  errors: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
  initErrors: PropTypes.func.isRequired,
  updateFields: PropTypes.func.isRequired,
  updateErrors: PropTypes.func.isRequired,
};

const mapStateToProps = ({ form }) => form || {};

const mapDispatchToProps = { initErrors, updateFields, updateErrors };

export default connect(mapStateToProps, mapDispatchToProps)(PaymentForm);
