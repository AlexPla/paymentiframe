import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PropTypes } from 'prop-types';
import { updateFields, updateErrors } from '@Actions';
import { CardHolderInput, CardNumberInput, CardExpDateInput } from '@Components';
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
    cardExpirationMonth: '',
    cardExpirationYear: '',
    updateFields: () => {},
    updateErrors: () => {},
  }

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
        <div className="payment-form__item grid grid_column grid_size-12">
          <CardExpDateInput
            lang={lang}
            updateFields={updateFields}
            updateErrors={updateErrors}
            value={date}
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
  cardExpirationMonth: PropTypes.string,
  cardExpirationYear: PropTypes.string,
  updateFields: PropTypes.func,
  updateErrors: PropTypes.func,
};

const mapStateToProps = ({ form }) => form;

const mapDispatchToProps = dispatch => bindActionCreators({ updateFields, updateErrors }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PaymentForm);
