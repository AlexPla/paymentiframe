import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateFields, updateErrors } from '../../actions';
import CardHolderInput from '../../components/CardHolderInput/CardHolderInput';
import CardNumberInput from '../../components/CardNumberInput/CardNumberInput';
import CardExpDateInput from '../../components/CardExpDateInput/CardExpDateInput';
import './PaymentForm.css';

const getParamValue=(paramName) => {
  const url = window.location.search.substring(1);
  const qArray = url.split('&');
  const param = qArray.find((element) => {
    return (element.split('=')[0] === paramName);
  });
  return param ? param[1] : null;
};

class PaymentForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      parentApp: getParamValue('app') || 'storefront',
      lang: getParamValue('lang') || 'es'
    };
  }

  render() {
    const { card_holder, card_number, card_type, card_expiration_month, card_expiration_year, updateFields, updateErrors } = this.props;
    const { parentApp, lang } = this.state;
    const date = {
      month: card_expiration_month,
      year: card_expiration_year
    };
    return (
      <div className='PaymentForm'>
        <header className='PaymentForm-header'>
          <h1 className='PaymentForm-title'>
            { parentApp }
          </h1>
        </header>
        <div className='payment-form__item grid grid_column grid_size-12'>
          <CardHolderInput lang={ lang } updateFields={ updateFields } updateErrors={ updateErrors } value={ card_holder } />
        </div>
        <div className='payment-form__item grid grid_column grid_size-12'>
          <CardNumberInput lang={ lang } updateFields={ updateFields } updateErrors={ updateErrors } value={ card_number } cardType={ card_type }/>
        </div>
        <div className='payment-form__item grid grid_column grid_size-12'>
          <CardExpDateInput lang={ lang } updateFields={ updateFields } updateErrors={ updateErrors } value={ date }/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ form }) => {
  return form;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ updateFields, updateErrors }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentForm);