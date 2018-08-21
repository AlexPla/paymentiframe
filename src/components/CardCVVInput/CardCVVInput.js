import React, { Component } from 'react';
import PropTypes from 'prop-types';
import copies from '../../copies/cardCVVInput';
import './CardCVVInput.css';

const CVV_LENGTH_DEFAULT = 3;
const CVV_TYPE_DEFAULT = 'CVV';

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
    };
    this.lastCardType = CVV_TYPE_DEFAULT;
    this.onInput = this.onInput.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onHelpClick = this.onHelpClick.bind(this);
  }

  onInput(e) {
    const pattern = new RegExp(`^[0-9]{0,${this.getLengthLimit()}}$`);
    const cvv = e.target.value.trim();
    if (pattern.test(cvv)) {
      const errorMessage = this.getErrorMessage(cvv);
      this.updateAppState(cvv, errorMessage);
      this.setState({ errorMessage });
    }
  }

  onHelpClick() {
    const { showHelp } = this.props;
    showHelp();
  }

  onBlur() {
    const { value } = this.props;
    const errorMessage = this.getErrorMessage(value);
    this.updateAppState(value, errorMessage);
    this.setState({
      errorDisabled: false,
      errorMessage,
    });
  }

  getErrorMessage(cvv) {
    const pattern = new RegExp(/^[0-9]{3,4}$/);
    const { lang } = this.props;

    switch (true) {
      case cvv.length === 0:
        return copies.errors.required[lang];
      case cvv.length < this.getLengthLimit() || !pattern.test(cvv):
        return 'validation failed';
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

  render() {
    const { value, cardType, lang } = this.props;
    const { errorMessage, errorDisabled } = this.state;
    const isEmpty = (value).toString().length === 0;
    const code = cardType ? cardType.code.name : CVV_TYPE_DEFAULT;
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    /* eslint-disable jsx-a11y/click-events-have-key-events */
    return (
      <div className="card-cvv-input__input-group">
        <input
          className={`card-cvv-input__input ${!isEmpty && 'card-cvv-input__input_not-empty'} ${!errorDisabled && errorMessage && 'card-cvv-input__input_invalid'}`}
          type="password"
          autoComplete="off"
          name="cardCVVInput"
          value={value}
          onInput={this.onInput}
          onBlur={this.onBlur}
        />
        <label htmlFor="cardCVVInput" className="card-cvv-input__label">{ copies[code][lang] }</label>
        <svg className="card-cvv-input__icon" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 150 150" preserveAspectRatio="xMidYMid meet">
          <path d="M129.7125,51.31875 L113.925,51.31875 L113.925,38.690625 C113.925,17.3625 96.46875,0 75.009375,0 C53.540625,0 36.084375,17.3625 36.084375,38.690625 L36.084375,51.31875 L20.296875,51.31875 C9.178125,51.31875 1.9875,58.509375 1.9875,69.6375 L1.9875,131.68125 C1.978125,142.809375 9.178125,150 20.296875,150 L129.7125,150 C140.85,150 148.040625,142.809375 148.040625,131.68125 L148.040625,69.6375 C148.03125,58.509375 140.83125,51.31875 129.7125,51.31875 L129.7125,51.31875 Z M140.1375,131.690625 C140.1375,138.515625 136.528125,142.115625 129.7125,142.115625 L20.296875,142.115625 C13.48125,142.115625 9.88125,138.50625 9.88125,131.690625 L9.88125,69.6375 C9.88125,62.8125 13.48125,59.2125 20.296875,59.2125 L129.7125,59.2125 C136.5375,59.2125 140.1375,62.821875 140.1375,69.6375 L140.1375,131.690625 L140.1375,131.690625 Z M43.978125,38.690625 C43.978125,21.703125 57.890625,7.89375 75.009375,7.89375 C92.1375,7.89375 106.021875,21.703125 106.021875,38.690625 L106.021875,51.31875 L43.978125,51.31875 L43.978125,38.690625 L43.978125,38.690625 Z" />
        </svg>

        <span className="card-cvv-input__help-button" onClick={this.onHelpClick}> ? </span>

        { !errorDisabled && errorMessage
          && (
          <span className="card-cvv-input__error">
            {' '}
            { errorMessage }
            {' '}
          </span>
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
  cardType: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  value: PropTypes.string,
};

export default CardCVVInput;
