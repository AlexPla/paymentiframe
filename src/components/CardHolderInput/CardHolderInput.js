import React, { Component } from 'react';
import PropTypes from 'prop-types';
import copies from '@Copies/cardHolderInput';
import './CardHolderInput.css';

class CardHolderInput extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      errorMessage: '',
      errorDisabled: true,
    };

    this.onInput = this.onInput.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onClearClick = this.onClearClick.bind(this);
  }

  onInput(e) {
    const cardHolder = e.target.value;
    const errorMessage = this.validateInput(cardHolder);
    this.updateAppState(cardHolder, errorMessage);
    this.setState({ errorMessage });
  }

  onClearClick() {
    const { lang } = this.props;
    const errorMessage = copies.errors.required[lang];
    this.updateAppState('', errorMessage);
    this.setState({
      errorMessage,
      errorDisabled: false,
    });
  }

  onBlur() {
    let { value: cardHolder } = this.props;
    cardHolder = cardHolder.trim();
    const errorMessage = this.validateInput(cardHolder);
    this.updateAppState(cardHolder, errorMessage);
    this.setState({
      errorDisabled: false,
      errorMessage,
    });
  }

  validateInput(input) {
    const pattern = new RegExp(/^[a-zA-Zñçáéíóúàèòïü´ÑÇÁÉÍÓÚÀÈÒÏÜ]+([\‒\-\-]+[a-zA-Zñçáéíóúàèòïü´ÑÇÁÉÍÓÚÀÈÒÏÜ]+)*([\s]+([a-zA-Zñçáéíóúàèòïü´ÑÇÁÉÍÓÚÀÈÒÏÜ]+([\‒\-\-]+[a-zA-Zñçáéíóúàèòïü´ÑÇÁÉÍÓÚÀÈÒÏÜ]+)*))*$/); // eslint-disable-line no-useless-escape
    const { lang } = this.props;
    switch (true) {
      case input.length === 0:
        return copies.errors.required[lang];
      case input.length < 2:
        return 'systemMessages.SM18';
      case input.length > 100:
        return 'maximum length exceeded';
      case !pattern.test(input):
        return 'systemMessages.SM26';
      default:
        return '';
    }
  }

  updateAppState(cardHolder, errorMessage) {
    const { updateFields, updateErrors } = this.props;
    updateFields({ cardHolder });
    updateErrors({
      key: 'cardHolder',
      value: !!errorMessage,
    });
  }

  render() {
    const { value, lang } = this.props;
    const { errorMessage, errorDisabled } = this.state;
    const isEmpty = (value).toString().length === 0;
    return (
      <div className="card-holder-input__input-group">
        <input
          className={`card-holder-input__input ${!isEmpty && 'card-holder-input__input_not-empty'} ${!errorDisabled && errorMessage && 'card-holder-input__input_invalid'}`}
          type="text"
          autoComplete="on"
          id="cardHolderInput"
          value={value}
          onInput={this.onInput}
          onBlur={this.onBlur}
        />
        <label htmlFor="cardHolderInput" className="card-holder-input__label">{ copies.holder[lang] }</label>
        <svg className="card-holder-input__icon" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 150 150" preserveAspectRatio="xMidYMid meet">
          <path d="M95.540625,75.225 C108.1875,68.296875 116.75625,55.21875 116.75625,40.21875 C116.75625,18.046875 98.025,0 75,0 C51.975,0 33.24375,18.046875 33.24375,40.21875 C33.24375,55.21875 41.8125,68.296875 54.459375,75.225 C23.071875,83.85 0,111.61875 0,144.525 C0,144.890625 0.028125,145.2375 0.084375,145.95 C0.084375,148.190625 1.89375,150 4.134375,150 L145.875,150 C148.10625,150 149.953125,147.825 149.953125,145.584375 C149.971875,145.2375 150,144.890625 150,144.525 C150,111.61875 126.928125,83.85 95.540625,75.225 L95.540625,75.225 Z M41.353125,40.21875 C41.353125,22.51875 56.446875,8.109375 75,8.109375 C93.553125,8.109375 108.646875,22.51875 108.646875,40.21875 C108.646875,57.946875 93.553125,72.365625 75,72.365625 C56.446875,72.365625 41.353125,57.946875 41.353125,40.21875 L41.353125,40.21875 Z M8.165625,141.890625 C9.609375,107.8125 39.0375,80.5125 75,80.5125 C110.840625,80.5125 140.19375,107.64375 141.796875,141.88125 L8.165625,141.88125 L8.165625,141.890625 Z" />
        </svg>
        { !isEmpty
          && (
          <svg className="card-holder-input__clear-button" onClick={this.onClearClick} version="1.1" xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 150 150" preserveAspectRatio="xMidYMid meet">
            <path d="M75.253125,1.021875 C34.10625,1.021875 0.76875,34.359375 0.76875,75.50625 C0.76875,116.653125 34.10625,150 75.253125,150 C116.41875,150 149.7375,116.6625 149.7375,75.515625 C149.7375,34.36875 116.41875,1.021875 75.253125,1.021875 L75.253125,1.021875 Z M107.85,97.715625 L97.4625,108.09375 L75.253125,85.884375 L53.053125,108.09375 L42.675,97.715625 L64.875,75.515625 L42.675,53.30625 L53.053125,42.928125 L75.2625,65.1375 L97.4625,42.928125 L107.85,53.30625 L85.640625,75.515625 L107.85,97.715625 L107.85,97.715625 Z" />
          </svg>
          )
        }
        { !errorDisabled && errorMessage
          && (
          <span className="card-holder-input__error">{` ${errorMessage} `}</span>
          )
        }
      </div>
    );
  }
}

CardHolderInput.propTypes = {
  updateFields: PropTypes.func.isRequired,
  updateErrors: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
};

export default CardHolderInput;
