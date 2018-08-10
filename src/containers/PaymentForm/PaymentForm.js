import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateFields, updateErrors } from '../../actions/actionTypes';
import CardNumberInput from '../../components/CardNumberInput/CardNumberInput';
import './PaymentForm.css';

const getParamValue=(paramName) => {
  const url = window.location.search.substring(1);
  const qArray = url.split('&');
  const param = qArray.find((element) => {
    return (element.split('=')[0] === paramName);
  });
  return param ? param[1] : null;
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
    const { card_number, card_type, updateFields, updateErrors } = this.props;
    const { parentApp, lang } = this.state;
    return (
      <div className='PaymentForm'>
        <header className='PaymentForm-header'>
          <h1 className='PaymentForm-title'>
            { parentApp }
          </h1>
        </header>
        <div className='payment-form__item grid grid_column grid_size-12'>
          <CardNumberInput lang={ lang } updateFields={ updateFields } updateErrors={ updateErrors } value={ card_number } cardType={ card_type }/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ form }) => {
  return form;
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ updateFields, updateErrors }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentForm);
