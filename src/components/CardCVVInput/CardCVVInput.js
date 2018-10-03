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
  }

  onInput = (e) => {
    const pattern = new RegExp(`^[0-9]{0,${this.getLengthLimit()}}$`);
    const cvv = e.target.value.trim();
    if (pattern.test(cvv)) {
      const errorMessage = this.getErrorMessage(cvv);
      this.updateAppState(cvv, errorMessage);
      this.setState({ errorMessage });
    }
  }

  onFocus = () => this.setState({ errorDisabled: true });

  onBlur = () => {
    const { value } = this.props;
    this.setState({ errorDisabled: !value });
  }

  onShowClick = () => {
    this.setState(prevState => ({ masked: !prevState.masked }));
  }

  getErrorMessage = (cvv) => {
    const pattern = new RegExp(`^[0-9]{${this.getLengthLimit()}}$`);
    const { lang } = this.props;
    let error = '';

    if (cvv.length === 0) {
      error = copies.errors.required[lang];
    } else if (!pattern.test(cvv)) {
      error = copies.errors.pattern[lang];
    }
    return error;
  }

  getLengthLimit = () => {
    const { cardType } = this.props;
    return cardType ? cardType.code.size : CVV_LENGTH_DEFAULT;
  }

  updateAppState = (cardCVV, errorMessage) => {
    const { updateFields, updateErrors } = this.props;
    updateFields({ cardCVV });
    updateErrors({
      key: 'cardCVV',
      value: errorMessage,
    });
  }

  renderEye = (parentApp, masked) => (
    <svg className={`card-cvv-input__show-button card-cvv-input__show-button__${parentApp}`} onClick={this.onShowClick} xmlns="http://www.w3.org/1999/svg" width="20" height="20" viewBox="0 0 20 20">
      <defs>
        <path id="a" d="M0 .814h18.042V11H.001z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 4.186)">
          <mask id="b" fill="#fff">
            <use xlinkHref="#a" />
          </mask>
          <path fill="#999" d="M0 6.115S3.938 11 9.297 11c2.666 0 5.684-1.21 8.746-4.835 0 0-3.47-5.35-8.829-5.35-2.669 0-5.804 1.326-9.212 5.3zm16.713-.002C14.36 8.693 11.868 10 9.296 10 5.61 10 2.582 7.33 1.39 6.106c2.619-2.849 5.247-4.292 7.823-4.292 3.702 0 6.48 3.01 7.5 4.3z" mask="url(#b)" />
        </g>
        <path fill="#999" d="M10.021 6.837c-1.893 0-3.428 1.448-3.428 3.234s1.535 3.233 3.428 3.233c1.894 0 3.428-1.447 3.428-3.233s-1.534-3.234-3.428-3.234m0 1c1.306 0 2.368 1.002 2.368 2.234 0 1.23-1.062 2.233-2.368 2.233-1.305 0-2.367-1.002-2.367-2.233 0-1.232 1.062-2.234 2.367-2.234" />
        { !masked
          && <path stroke="#999" strokeLinecap="round" strokeLinejoin="round" d="M15 4.5L5.5 16" />
        }
      </g>
    </svg>
  );

  renderIcon = (errorDisabled, errorMessage) => (
    <svg className={`card-cvv-input__icon ${!errorDisabled && errorMessage && 'card-cvv-input__icon_invalid'}`} version="1.1" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 150 150" preserveAspectRatio="xMidYMid meet">
      <path d="M129.7125,51.31875 L113.925,51.31875 L113.925,38.690625 C113.925,17.3625 96.46875,0 75.009375,0 C53.540625,0 36.084375,17.3625 36.084375,38.690625 L36.084375,51.31875 L20.296875,51.31875 C9.178125,51.31875 1.9875,58.509375 1.9875,69.6375 L1.9875,131.68125 C1.978125,142.809375 9.178125,150 20.296875,150 L129.7125,150 C140.85,150 148.040625,142.809375 148.040625,131.68125 L148.040625,69.6375 C148.03125,58.509375 140.83125,51.31875 129.7125,51.31875 L129.7125,51.31875 Z M140.1375,131.690625 C140.1375,138.515625 136.528125,142.115625 129.7125,142.115625 L20.296875,142.115625 C13.48125,142.115625 9.88125,138.50625 9.88125,131.690625 L9.88125,69.6375 C9.88125,62.8125 13.48125,59.2125 20.296875,59.2125 L129.7125,59.2125 C136.5375,59.2125 140.1375,62.821875 140.1375,69.6375 L140.1375,131.690625 L140.1375,131.690625 Z M43.978125,38.690625 C43.978125,21.703125 57.890625,7.89375 75.009375,7.89375 C92.1375,7.89375 106.021875,21.703125 106.021875,38.690625 L106.021875,51.31875 L43.978125,51.31875 L43.978125,38.690625 L43.978125,38.690625 Z" />
    </svg>
  );

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
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
        { parentApp === configs.STOREFRONT
          && <label htmlFor="cardCVVInput" className="card-cvv-input__label__storefront">{ code }</label>
        }
        { !isEmpty && this.renderEye(parentApp, masked) }
        { parentApp === configs.STOREFRONT && this.renderIcon(errorDisabled, errorMessage) }
        <span className={`card-cvv-input__help-button card-cvv-input__help-button__${parentApp}`} onClick={showHelp}> ? </span>
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
