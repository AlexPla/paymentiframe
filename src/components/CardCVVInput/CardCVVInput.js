import React, { Component } from 'react';
import PropTypes from 'prop-types';
import copies from '@Copies/cardCVVInput';
import { CVV_LENGTH_DEFAULT, CVV_TYPE_DEFAULT } from '@Constants/creditCard';
import * as configs from '@Constants/configs';
import './CardCVVInput.css';

class CardCVVInput extends Component {
  static defaultProps = {
    cardType: false,
    value: '',
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      errorMessage: '',
      errorDisabled: true,
      masked: true,
    };
    this.lastCardType = CVV_TYPE_DEFAULT;
    this.onInput = this.onInput.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onShowClick = this.onShowClick.bind(this);
  }

  onInput(e) {
    const pattern = new RegExp(`^[0-9]{0,${this.getLengthLimit()}}$`);
    const cvv = e.target.value.trim();
    if (pattern.test(cvv)) {
      const errorMessage = this.getErrorMessage(cvv);
      this.updateAppState(cvv, errorMessage);
      this.setState({ errorMessage: this.visualError(errorMessage) });
    }
  }

  onBlur() {
    const { value } = this.props;
    const errorMessage = this.getErrorMessage(value);
    this.updateAppState(value, errorMessage);
    this.setState({
      errorDisabled: false,
      errorMessage: this.visualError(errorMessage),
    });
  }

  onShowClick() {
    const { masked } = this.state;
    this.setState({
      masked: !masked,
    });
  }

  getErrorMessage(cvv) {
    const pattern = new RegExp(`^[0-9]{${this.getLengthLimit()}}$`);
    const { lang } = this.props;

    switch (true) {
      case cvv.length === 0:
        return copies.errors.required[lang];
      case !pattern.test(cvv):
        return copies.errors.pattern[lang];
      default:
        return '';
    }
  }

  getLengthLimit() {
    const { cardType } = this.props;
    return cardType ? cardType.code.size : CVV_LENGTH_DEFAULT;
  }

  updateAppState(cardCVV, errorMessage) {
    const { updateFields, updateErrors } = this.props;
    updateFields({ cardCVV });
    updateErrors({
      key: 'cardCVV',
      value: !!errorMessage,
    });
  }

  visualError(errorMessage) {
    const { lang } = this.props;
    return errorMessage === copies.errors.required[lang] ? '' : errorMessage;
  }

  render() {
    const {
      value,
      cardType,
      lang,
      parentApp,
      showHelp,
    } = this.props;
    const { errorMessage, errorDisabled, masked } = this.state;
    const isEmpty = (value).toString().length === 0;
    const code = cardType ? cardType.code.name : CVV_TYPE_DEFAULT;
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    /* eslint-disable jsx-a11y/click-events-have-key-events */
    return (
      <div className={`card-cvv-input__input-group card-cvv-input__input-group__${parentApp}`}>
        { parentApp !== configs.STOREFRONT
          && <label htmlFor="cardNumberInput" className="card-cvv-input__label__legacy">{ copies.placeholder[lang] }</label>
        }
        <input
          className={
            `card-cvv-input__input card-cvv-input__input__${parentApp}
            ${!isEmpty && 'card-cvv-input__input__not-empty'}
            ${!errorDisabled && errorMessage && 'card-cvv-input__input_invalid'}
            ${masked && 'card-cvv-input__input__masked'}`
          }
          type="text"
          autoComplete="off"
          name="cardCVVInput"
          value={value}
          onInput={this.onInput}
          onBlur={this.onBlur}
        />
        { parentApp === configs.STOREFRONT
          && <label htmlFor="cardCVVInput" className="card-cvv-input__label__storefront">{ copies[code][lang] }</label>
        }
        { !isEmpty
          && (
          <svg className={`card-cvv-input__show-button card-cvv-input__show-button__${parentApp}`} onClick={this.onShowClick} version="1.1" xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 150 150" preserveAspectRatio="xMidYMid meet">
            <path d="M75.253125,1.021875 C34.10625,1.021875 0.76875,34.359375 0.76875,75.50625 C0.76875,116.653125 34.10625,150 75.253125,150 C116.41875,150 149.7375,116.6625 149.7375,75.515625 C149.7375,34.36875 116.41875,1.021875 75.253125,1.021875 L75.253125,1.021875 Z M107.85,97.715625 L97.4625,108.09375 L75.253125,85.884375 L53.053125,108.09375 L42.675,97.715625 L64.875,75.515625 L42.675,53.30625 L53.053125,42.928125 L75.2625,65.1375 L97.4625,42.928125 L107.85,53.30625 L85.640625,75.515625 L107.85,97.715625 L107.85,97.715625 Z" />
          </svg>
          )
        }
        { parentApp === configs.STOREFRONT
          && (
          <svg className={`card-cvv-input__icon ${!errorDisabled && errorMessage && 'card-cvv-input__icon_invalid'}`} version="1.1" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 150 150" preserveAspectRatio="xMidYMid meet">
            <path d="M129.7125,51.31875 L113.925,51.31875 L113.925,38.690625 C113.925,17.3625 96.46875,0 75.009375,0 C53.540625,0 36.084375,17.3625 36.084375,38.690625 L36.084375,51.31875 L20.296875,51.31875 C9.178125,51.31875 1.9875,58.509375 1.9875,69.6375 L1.9875,131.68125 C1.978125,142.809375 9.178125,150 20.296875,150 L129.7125,150 C140.85,150 148.040625,142.809375 148.040625,131.68125 L148.040625,69.6375 C148.03125,58.509375 140.83125,51.31875 129.7125,51.31875 L129.7125,51.31875 Z M140.1375,131.690625 C140.1375,138.515625 136.528125,142.115625 129.7125,142.115625 L20.296875,142.115625 C13.48125,142.115625 9.88125,138.50625 9.88125,131.690625 L9.88125,69.6375 C9.88125,62.8125 13.48125,59.2125 20.296875,59.2125 L129.7125,59.2125 C136.5375,59.2125 140.1375,62.821875 140.1375,69.6375 L140.1375,131.690625 L140.1375,131.690625 Z M43.978125,38.690625 C43.978125,21.703125 57.890625,7.89375 75.009375,7.89375 C92.1375,7.89375 106.021875,21.703125 106.021875,38.690625 L106.021875,51.31875 L43.978125,51.31875 L43.978125,38.690625 L43.978125,38.690625 Z" />
          </svg>
          )
        }
        { parentApp !== configs.LEGACY_WEBMOBILE
          && <span className={`card-cvv-input__help-button card-cvv-input__help-button__${parentApp}`} onClick={showHelp}> ? </span>
        }
        { parentApp === configs.LEGACY_WEBMOBILE
          && <span className={`card-cvv-input__help-button card-cvv-input__help-button__${parentApp}`} onClick={showHelp}>¿Qué es?</span>
        }
        { !errorDisabled && errorMessage
          && (
          <span className="card-cvv-input__error">{` ${errorMessage} `}</span>
          )
        }
      </div>
    );
    /* eslint-enable jsx-a11y/no-static-element-interactions */
    /* eslint-enable jsx-a11y/click-events-have-key-events */
  }
}

CardCVVInput.propTypes = {
  updateFields: PropTypes.func.isRequired,
  updateErrors: PropTypes.func.isRequired,
  showHelp: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  parentApp: PropTypes.string.isRequired,
  cardType: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  value: PropTypes.string,
};

export default CardCVVInput;
