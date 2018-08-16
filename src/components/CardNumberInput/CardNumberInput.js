import React, { Component } from 'react';
import CreditCardType from '../../helpers/CreditCardType/CreditCardType';
import copies from '../../copies/cardNumberInput';
import './CardNumberInput.css';

class CardNumberInput extends Component {
  
  constructor(props, context) {
    super(props, context);

    this.state={
      errorMessage: '',
      errorDisabled: true
    }

    this.onInput=this.onInput.bind(this);
    this.onBlur=this.onBlur.bind(this);
    this.onClearClick=this.onClearClick.bind(this);
  }

  validateInput(value=this.props.value, card=this.props.cardType, minLength) {
    minLength=minLength ? minLength : CreditCardType.getCardType(value).minLength;
    let error='';
    if (value.length === 0) {
      error=copies.errors.required[this.props.lang];
    } else if (value.length < minLength) {
      error=copies.errors.minLength[this.props.lang];
    } else if (!card || (card.pattern && !(new RegExp(card.pattern).test(value)))) {
      error=copies.errors.pattern[this.props.lang];
    }
    return error;
  }

  updateAppState(value, cardType, errorMessage) {
    this.props.updateFields({
      card_number: value,
      card_type: cardType
    });

    this.props.updateErrors({ 
      card_number: Boolean(errorMessage)
    });
  }

  onInput(e) {
    let value=CreditCardType.removeGaps(e.target.value);
    let { cardType, maxLength, minLength }=CreditCardType.getCardType(value);
    let errorDisabled=this.state.errorDisabled;

    if (value.length > maxLength) {
      value=this.props.value;
    } else if (value.length === maxLength) {
      errorDisabled=false;
    }
    
    const errorMessage=this.validateInput(value, cardType, minLength);

    this.updateAppState(value, cardType, errorMessage);

    this.setState({
      errorMessage,
      errorDisabled
    });
  }

  onClearClick() {
    const errorMessage=copies.errors.required[this.props.lang];

    this.updateAppState('', false, errorMessage);

    this.setState({
      errorMessage,
      errorDisabled: false
    });
  }

  onBlur() {
    const errorMessage=this.validateInput();

    this.setState({
      errorMessage,
      errorDisabled: false
    });
  }

  render() {
    const { value, cardType }=this.props;
    const { errorMessage, errorDisabled }=this.state;
    const isEmpty=(value).toString().length === 0;
    const visualValue=CreditCardType.addGaps(value, cardType);
    return (
      <div className='card-number-input__input-group' >
        <input
          className={ `card-number-input__input ${ !isEmpty && 'card-number-input__input_not-empty' } ${ !errorDisabled && errorMessage && 'card-number-input__input_invalid' }` }
          type='text'
          inputMode='numeric'
          pattern='[0-9]*'
          autoComplete='off'
          name='cardNumberInput'
          value={ visualValue }
          onInput={ this.onInput }
          onBlur={ this.onBlur }
          noValidate
        />
        <label className='card-number-input__label'>{ copies.placeholder[this.props.lang] }</label>
        <svg className='card-number-input__icon' version='1.1' xmlns='http://www.w3.org/2000/svg' width='20px' height='20px' viewBox='0 0 150 150' preserveAspectRatio='xMidYMid meet'>
          <path d='m 122.2875,10.431249 -94.574999,0 C 11.653125,10.431249 0,22.131249 0,38.246874 L 0,111.175 C 0,127.3 11.653125,139 27.712501,139 l 94.574999,0 C 138.34687,139 150,127.3 150,111.175 l 0,-72.928126 C 150,22.131249 138.34687,10.431249 122.2875,10.431249 l 0,0 z m 20.56875,39.28125 -135.7125,0 0,-11.465625 c 0,-11.98125 8.653125,-20.68125 20.568751,-20.68125 l 94.574999,0 c 11.91563,0 20.56875,8.7 20.56875,20.68125 l 0,11.465625 0,0 z m -20.56875,82.143751 -94.574999,0 c -11.915626,0 -20.568751,-8.70938 -20.568751,-20.68125 l 0,-40.031251 135.72188,0 0,40.040621 c -0.009,11.97188 -8.6625,20.67188 -20.57813,20.67188 l 0,0 z' />
        </svg>
        { cardType && cardType.type &&
          <div className='card-number-input__card-type'>
            <span className={ `card-number-input__card-type_icon card-number-input__card-type_icon_${cardType.type}` } />
          </div>
        }
        { !isEmpty &&
          <svg className='card-number-input__clear-button' onClick={ this.onClearClick } version='1.1' xmlns='http://www.w3.org/2000/svg' width='15px' height='15px' viewBox='0 0 150 150' preserveAspectRatio='xMidYMid meet'>
            <path d='M75.253125,1.021875 C34.10625,1.021875 0.76875,34.359375 0.76875,75.50625 C0.76875,116.653125 34.10625,150 75.253125,150 C116.41875,150 149.7375,116.6625 149.7375,75.515625 C149.7375,34.36875 116.41875,1.021875 75.253125,1.021875 L75.253125,1.021875 Z M107.85,97.715625 L97.4625,108.09375 L75.253125,85.884375 L53.053125,108.09375 L42.675,97.715625 L64.875,75.515625 L42.675,53.30625 L53.053125,42.928125 L75.2625,65.1375 L97.4625,42.928125 L107.85,53.30625 L85.640625,75.515625 L107.85,97.715625 L107.85,97.715625 Z' />
          </svg>
        }
        { !errorDisabled && errorMessage &&
          <span className='card-number-input__error' > { errorMessage } </span>
        }
      </div>
    );
  }
};

export default CardNumberInput;