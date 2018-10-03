import React, { Component } from 'react';
import PropTypes from 'prop-types';
import copies from '@Copies/zipCodeInput';
import { ZIP_CODE_MAX_LENGTH } from '@Constants/creditCard';
import { ZipCodeHelper } from '@Helpers';
import * as configs from '@Constants/configs';
import './ZipCodeInput.css';

class ZipCodeInput extends Component {
  constructor(props, context) {
    super(props, context);

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
    let value = ZipCodeHelper.extractValueFromVisualValue(e.target.value);
    const { value: oldValue } = this.props;

    if (value.length > ZIP_CODE_MAX_LENGTH) {
      value = oldValue;
    }

    const errorMessage = ZipCodeHelper.validateInput(value);
    this.updateAppState(value, errorMessage);
    this.setState({ errorMessage });
  }

  onClearClick() {
    const errorMessage = copies.errors.required;

    this.updateAppState('', false, errorMessage);

    this.setState({
      errorMessage,
      errorDisabled: true,
    });
  }

  onFocus() {
    this.setState({ errorDisabled: true });
  }

  onBlur() {
    const { value } = this.props;
    this.setState({ errorDisabled: !value });
  }

  updateAppState(value, errorMessage) {
    const { updateFields, updateErrors } = this.props;
    updateFields({ zipCode: value });

    updateErrors({
      key: 'zipCode',
      value: errorMessage,
    });
  }

  renderIcon = (errorDisabled, errorMessage) => (
    <svg className={`zip-code__icon ${!errorDisabled && errorMessage && 'zip-code__icon_invalid'}`} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" preserveAspectRatio="xMidYMid meet">
      <g fill="none" fillRule="evenodd">
        <path d="M14.5 18.5h2v-17h-13v17h2v-2h9v2z" />
        <path d="M5.5 3.5h9v2h-9zM6.5 8.5v5h7v-5h-7z" />
        <path strokeLinejoin="round" d="M7 9c1.5 1.333 2.5 2 3 2s1.5-.667 3-2" />
      </g>
    </svg>
  );

  renderClearButton = parentApp => (
    <svg className={`zip-code__clear-button zip-code__clear-button__${parentApp}`} onMouseDown={this.onClearClick} version="1.1" xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 150 150" preserveAspectRatio="xMidYMid meet">
      <path d="M75.253125,1.021875 C34.10625,1.021875 0.76875,34.359375 0.76875,75.50625 C0.76875,116.653125 34.10625,150 75.253125,150 C116.41875,150 149.7375,116.6625 149.7375,75.515625 C149.7375,34.36875 116.41875,1.021875 75.253125,1.021875 L75.253125,1.021875 Z M107.85,97.715625 L97.4625,108.09375 L75.253125,85.884375 L53.053125,108.09375 L42.675,97.715625 L64.875,75.515625 L42.675,53.30625 L53.053125,42.928125 L75.2625,65.1375 L97.4625,42.928125 L107.85,53.30625 L85.640625,75.515625 L107.85,97.715625 L107.85,97.715625 Z" />
    </svg>
  );

  render() {
    const { value, parentApp } = this.props;
    const { errorMessage, errorDisabled } = this.state;
    const isEmpty = (value).toString().length === 0;
    return (
      <div className={`zip-code__input-group zip-code__input-group__${parentApp}`}>
        { parentApp !== configs.STOREFRONT
          && <label htmlFor="zipCodeInput" className="zip-code__label__legacy">{ copies.placeholder }</label>
        }
        <input
          className={`zip-code__input zip-code__input__${parentApp} ${!isEmpty && 'zip-code__input__not-empty'} ${!errorDisabled && errorMessage && 'zip-code__input_invalid'}`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          id="zipCodeInput"
          value={value}
          onInput={this.onInput}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          noValidate
        />
        { parentApp === configs.STOREFRONT
          && <label htmlFor="ZipCodeInput" className="zip-code__label__storefront">{ copies.placeholder }</label>
        }
        { parentApp === configs.STOREFRONT && this.renderIcon(errorDisabled, errorMessage) }
        { !isEmpty && this.renderClearButton(parentApp) }
        { !errorDisabled && errorMessage
          && (
          <span className="zip-code__error">{` ${errorMessage} `}</span>
          )
        }
      </div>
    );
  }
}

ZipCodeInput.propTypes = {
  updateFields: PropTypes.func.isRequired,
  updateErrors: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  parentApp: PropTypes.string.isRequired,
};

export default ZipCodeInput;
