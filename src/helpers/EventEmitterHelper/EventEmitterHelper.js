import * as configs from '@Constants/configs';

const EventEmitterHelper = {
  sendCvvEvent(parentApp) {
    if ([configs.LEGACY, configs.LEGACY_WEBMOBILE].indexOf(parentApp) !== -1
      && window.parent.PRV) {
      window.parent.PRV.Event.emit('piframe_cvv_help');
    } else {
      window.parent.postMessage({ id: 'piframe_cvv_help' }, '*');
    }
  },

  sendChangeEvent(parentApp, props) {
    const {
      cardHolder,
      cardNumber,
      errors,
    } = props;
    const data = {
      cardHolder,
      cardBin: cardNumber.substring(0, 5),
      cardLastFour: cardNumber.slice(-4),
      cardEncryptedJson: '',
      errors,
    };
    if ([configs.LEGACY, configs.LEGACY_WEBMOBILE].indexOf(parentApp) !== -1
      && window.parent.PRV) {
      window.parent.PRV.Event.emit('piframe_change', '', data);
    } else {
      window.parent.postMessage({ id: 'piframe_change', data }, '*');
    }
  },
};

export default EventEmitterHelper;
