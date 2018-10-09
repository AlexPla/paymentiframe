import { AdyenEncryptionHelper } from '@Helpers';

const EventEmitterHelper = {
  sendCvvEvent() {
    window.parent.postMessage({ id: 'piframe_cvv_help' }, '*'); // todo change. DANGER to use. https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#Security_concerns
  },

  sendChangeEvent(prod, props) {
    const {
      cardHolder,
      cardNumber,
      cardCVV,
      cardExpirationMonth,
      cardExpirationYear,
      errors,
    } = props;
    const cardExpiration = {
      month: cardExpirationMonth,
      year: `20${cardExpirationYear}`,
    };
    // eslint-disable-next-line max-len
    return AdyenEncryptionHelper.encrypt(prod, cardNumber, cardCVV, cardHolder, cardExpirationMonth, `20${cardExpirationYear}`)
      .then(([cardEncryptedJson]) => {
        const data = {
          cardBin: cardNumber.substring(0, 5),
          cardLastFour: cardNumber.slice(-4),
          cardEncryptedJson,
          cardHolder,
          cardExpiration,
          errors,
        };
        window.parent.postMessage({ id: 'piframe_change', data }, '*'); // todo change. DANGER to use. https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#Security_concerns
      });
  },

  sendHeightEvent(height) {
    const data = { height };
    window.parent.postMessage({ id: 'piframe_height', data }, '*'); // todo change. DANGER to use. https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#Security_concerns
  },
};

export default EventEmitterHelper;
