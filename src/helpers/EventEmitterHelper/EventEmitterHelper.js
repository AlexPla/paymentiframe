import * as configs from '@Constants/configs';
import { AdyenEncryptionHelper } from '@Helpers';

const EventEmitterHelper = {
  sendCvvEvent(parentApp) {
    if ([configs.LEGACY, configs.LEGACY_WEBMOBILE].indexOf(parentApp) !== -1
      && window.parent.PRV) {
      window.parent.PRV.Event.emit('piframe_cvv_help');
    } else {
      window.parent.postMessage({ id: 'piframe_cvv_help' }, '*'); // todo change. DANGER to use. https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#Security_concerns
    }
  },

  sendChangeEvent(parentApp, prod, props) {
    const {
      cardHolder,
      cardNumber,
      cardCVV,
      cardExpirationMonth,
      cardExpirationYear,
      errors,
    } = props;
    // eslint-disable-next-line max-len
    return AdyenEncryptionHelper.encrypt(prod, cardNumber, cardCVV, cardHolder, cardExpirationMonth, `20${cardExpirationYear}`)
      .then(([cardEncryptedJson]) => {
        const data = {
          cardBin: cardNumber.substring(0, 5),
          cardLastFour: cardNumber.slice(-4),
          cardEncryptedJson,
          cardHolder,
          errors,
        };
        if ([configs.LEGACY, configs.LEGACY_WEBMOBILE].indexOf(parentApp) !== -1
          && window.parent.PRV) {
          window.parent.PRV.Event.emit('piframe_change', '', data);
        } else {
          window.parent.postMessage({ id: 'piframe_change', data }, '*'); // todo change. DANGER to use. https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#Security_concerns
        }
      });
  },

  sendHeightEvent(height) {
    const data = { height };
    window.parent.postMessage({ id: 'piframe_height', data }, '*'); // todo change. DANGER to use. https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#Security_concerns
  },
};

export default EventEmitterHelper;
