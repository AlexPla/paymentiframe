import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import ExpDateHelper from '../../helpers/ExpDateHelper/ExpDateHelper';
import copies from '../../copies/cardExpDateInput';
import './CardExpDateInput.css';

class CardExpDateInput extends Component {
  
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

  validateInput(value = this.props.value) {
    let error='';
    if (!value.month && !value.year) {
      error=copies.errors.required[this.props.lang];
    } else if (value.month.length < 2 || value.year.length < 2) {
      error=copies.errors.incomplete[this.props.lang];
    } else {
      const pattern=new RegExp(/(0[1-9]|1[0-2])\/\d\d/).exec(`${value.month}/${value.year}`);
      if (!pattern) {
        error=copies.errors.pattern[this.props.lang];
      } else {
        const currDate=moment(new Date()).format('MM/YY');
        const currMonth=currDate.substr(0,2);
        const currYear=currDate.substr(3,2);
        if (value.year < currYear || (value.year === currYear && value.month < currMonth)) {
          error=copies.errors.posterior[this.props.lang];
        }
      }
    }
    return error;
  }

  updateAppState(month, year, errorMessage) {
    this.props.updateFields({
      card_expiration_month: month,
      card_expiration_year: year,
    });

    this.props.updateErrors({ 
      card_expiration: Boolean(errorMessage)
    });
  }

  onInput(e) {
    let value=ExpDateHelper.extractValueFromVisualValue(e.target.value);
    let errorDisabled=this.state.errorDisabled;

    if (e.target.value.length > 7) {
      value=this.props.value;
    } else if (value.month.length === 2 && value.year.length === 2) {
      errorDisabled=false;
    }
    
    const errorMessage=this.validateInput(value);

    this.updateAppState(value.month, value.year, errorMessage);

    this.setState({
      errorMessage,
      errorDisabled
    });
  }

  onClearClick() {
    const errorMessage=copies.errors.required[this.props.lang];

    this.updateAppState('', '', errorMessage);

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
    const { value }=this.props;
    const { errorMessage, errorDisabled }=this.state;
    const isEmpty=(value.month).toString().length === 0;
    const visualValue=`${value.month}${value.year?` / ${value.year}`:''}`;
    return (
      <div className='card-exp-date__input-group' >
        <input
          className={ `card-exp-date__input ${ !isEmpty && 'card-exp-date__input_not-empty' } ${ !errorDisabled && errorMessage && 'card-exp-date__input_invalid' }` }
          type='text'
          inputMode='numeric'
          pattern='[0-9]*'
          autoComplete='off'
          name='cardExpDateInput'
          value={ visualValue }
          onInput={ this.onInput }
          onBlur={ this.onBlur }
          noValidate
        />
        <label className='card-exp-date__label'>{ copies.placeholder[this.props.lang] }</label>
        { !isEmpty &&
          <svg className='card-exp-date__clear-button' onClick={ this.onClearClick } version='1.1' xmlns='http://www.w3.org/2000/svg' width='15px' height='15px' viewBox='0 0 150 150' preserveAspectRatio='xMidYMid meet'>
            <path d='M75.253125,1.021875 C34.10625,1.021875 0.76875,34.359375 0.76875,75.50625 C0.76875,116.653125 34.10625,150 75.253125,150 C116.41875,150 149.7375,116.6625 149.7375,75.515625 C149.7375,34.36875 116.41875,1.021875 75.253125,1.021875 L75.253125,1.021875 Z M107.85,97.715625 L97.4625,108.09375 L75.253125,85.884375 L53.053125,108.09375 L42.675,97.715625 L64.875,75.515625 L42.675,53.30625 L53.053125,42.928125 L75.2625,65.1375 L97.4625,42.928125 L107.85,53.30625 L85.640625,75.515625 L107.85,97.715625 L107.85,97.715625 Z' />
          </svg>
        }
        { !errorDisabled && errorMessage &&
          <span className='card-exp-date__error' > { errorMessage } </span>
        }
      </div>
    );
  }
};

CardExpDateInput.propTypes = {
  updateFields: PropTypes.func.isRequired,
  updateErrors: PropTypes.func.isRequired,
  value: PropTypes.objectOf(PropTypes.string)
}

export default CardExpDateInput;