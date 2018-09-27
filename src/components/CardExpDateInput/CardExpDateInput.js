import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { ExpDateHelper } from '@Helpers';
import copies from '@Copies/cardExpDateInput';
import * as configs from '@Constants/configs';
import './CardExpDateInput.css';

class CardExpDateInput extends Component {
  constructor(props, context) {
    super(props, context);

    this.expDateInput = React.createRef();

    this.state = {
      errorMessage: '',
      errorDisabled: true,
    };

    this.onInput = this.onInput.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onClearClick = this.onClearClick.bind(this);
  }

  onInput(e) {
    let value = ExpDateHelper.extractValueFromVisualValue(e.target.value);
    let { errorDisabled } = this.state;
    const { value: oldValue } = this.props;

    if (e.target.value.length > 7) {
      value = oldValue;
    } else if (value.month.length === 2 && value.year.length === 2) {
      errorDisabled = false;
    }

    const errorMessage = this.validateInput(value);

    this.updateAppState(value.month, value.year, errorMessage);

    this.setState({
      errorMessage: this.visualError(errorMessage),
      errorDisabled,
    });
  }

  onClearClick() {
    const { lang } = this.props;
    const errorMessage = copies.errors.required[lang];

    this.updateAppState('', '', errorMessage);

    this.setState({
      errorMessage: this.visualError(errorMessage),
      errorDisabled: false,
    });
  }

  onFocus() {
    const { lang } = this.props;
    this.expDateInput.current.placeholder = copies.help[lang];
  }

  onBlur() {
    const { value, parentApp } = this.props;
    this.expDateInput.current.placeholder = (parentApp === configs.STOREFRONT) ? '' : this.expDateInput.current.placeholder;
    const errorMessage = this.visualError(this.validateInput(value));
    this.setState({
      errorMessage,
      errorDisabled: false,
    });
  }

  validateInput(value) {
    const { lang } = this.props;
    let error = '';
    if (!value.month && !value.year) {
      error = copies.errors.required[lang];
    } else if (value.month.length < 2 || value.year.length < 2) {
      error = copies.errors.incomplete[lang];
    } else {
      const pattern = new RegExp(/(0[1-9]|1[0-2])\/\d\d/).exec(`${value.month}/${value.year}`);
      if (!pattern) {
        error = copies.errors.pattern[lang];
      } else {
        const currDate = moment(new Date()).format('MM/YY');
        const currMonth = currDate.substr(0, 2);
        const currYear = currDate.substr(3, 2);
        if (value.year < currYear || (value.year === currYear && value.month < currMonth)) {
          error = copies.errors.posterior[lang];
        }
      }
    }
    return error;
  }

  updateAppState(month, year, errorMessage) {
    const { updateFields, updateErrors } = this.props;
    updateFields({
      cardExpirationMonth: month,
      cardExpirationYear: year,
    });

    updateErrors({
      key: 'cardExpiration',
      value: Boolean(errorMessage),
    });
  }

  visualError(errorMessage) {
    const { lang } = this.props;
    return errorMessage === copies.errors.required[lang] ? '' : errorMessage;
  }

  render() {
    const { value, lang, parentApp } = this.props;
    const { errorMessage, errorDisabled } = this.state;
    const isEmpty = (value.month).toString().length === 0;
    const visualValue = ExpDateHelper.getVisualValue(value);
    return (
      <div className={`card-exp-date__input-group card-exp-date__input-group__${parentApp}`}>
        { parentApp !== configs.STOREFRONT
          && <label htmlFor="cardExpDateInput" className="card-exp-date__label__legacy">{ copies.placeholder[lang] }</label>
        }
        <input
          className={`card-exp-date__input card-exp-date__input__${parentApp} ${!isEmpty && 'card-exp-date__input__not-empty'} ${!errorDisabled && errorMessage && 'card-exp-date__input_invalid'}`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          id="cardExpDateInput"
          value={visualValue}
          onInput={this.onInput}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          noValidate
          placeholder={(parentApp !== configs.STOREFRONT) ? copies.help[lang] : ''}
          ref={this.expDateInput}
        />
        { parentApp === configs.STOREFRONT
          && <label htmlFor="cardExpDateInput" className="card-exp-date__label__storefront">{ copies.placeholder[lang] }</label>
        }
        { parentApp === configs.STOREFRONT
          && (
          <svg className={`card-exp-date__icon ${!errorDisabled && errorMessage && 'card-exp-date__icon_invalid'}`} width="20px" height="20px" viewBox="0 0 150 150" preserveAspectRatio="xMidYMid meet" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <g id="Page-1" stroke="none" strokeWidth="1" fillRule="evenodd">
              <g id="calendar" fillRule="nonzero">
                <g transform="translate(15.000000, 15.000000)">
                  <path d="M7.5,15 L7.5,112.5 L112.5,112.5 L112.5,15 L7.5,15 Z M7.5,7.5 L112.5,7.5 C116.642136,7.5 120,10.8578644 120,15 L120,112.5 C120,116.642136 116.642136,120 112.5,120 L7.5,120 C3.3578644,120 0,116.642136 0,112.5 L0,15 C0,10.8578644 3.3578644,7.5 7.5,7.5 Z" id="Rectangle-9" />
                  <path d="M33.75,0 C35.8210678,0 37.5,1.67893219 37.5,3.75 L37.5,18.75 C37.5,20.8210678 35.8210678,22.5 33.75,22.5 C31.6789322,22.5 30,20.8210678 30,18.75 L30,3.75 C30,1.67893219 31.6789322,0 33.75,0 Z" id="Rectangle-10" />
                  <path d="M86.25,0 C88.3210678,0 90,1.67893219 90,3.75 L90,18.75 C90,20.8210678 88.3210678,22.5 86.25,22.5 C84.1789322,22.5 82.5,20.8210678 82.5,18.75 L82.5,3.75 C82.5,1.67893219 84.1789322,0 86.25,0 Z" id="Rectangle-10" />
                  <polygon id="Rectangle-11" points="0 30 120 30 120 37.5 0 37.5" />
                </g>
              </g>
            </g>
          </svg>
          )
        }
        { !isEmpty
          && (
          <svg className={`card-exp-date__clear-button card-exp-date__clear-button__${parentApp}`} onMouseDown={this.onClearClick} version="1.1" xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 150 150" preserveAspectRatio="xMidYMid meet">
            <path d="M75.253125,1.021875 C34.10625,1.021875 0.76875,34.359375 0.76875,75.50625 C0.76875,116.653125 34.10625,150 75.253125,150 C116.41875,150 149.7375,116.6625 149.7375,75.515625 C149.7375,34.36875 116.41875,1.021875 75.253125,1.021875 L75.253125,1.021875 Z M107.85,97.715625 L97.4625,108.09375 L75.253125,85.884375 L53.053125,108.09375 L42.675,97.715625 L64.875,75.515625 L42.675,53.30625 L53.053125,42.928125 L75.2625,65.1375 L97.4625,42.928125 L107.85,53.30625 L85.640625,75.515625 L107.85,97.715625 L107.85,97.715625 Z" />
          </svg>
          )
        }
        { !errorDisabled && errorMessage
          && (
          <span className="card-exp-date__error">{` ${errorMessage} `}</span>
          )
        }
      </div>
    );
  }
}

CardExpDateInput.propTypes = {
  updateFields: PropTypes.func.isRequired,
  updateErrors: PropTypes.func.isRequired,
  value: PropTypes.objectOf(PropTypes.string).isRequired,
  lang: PropTypes.string.isRequired,
  parentApp: PropTypes.string.isRequired,
};

export default CardExpDateInput;
