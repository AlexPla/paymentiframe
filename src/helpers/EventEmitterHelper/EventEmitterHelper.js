import * as configs from '@Constants/configs';

const EventEmitterHelper = {
  sendCvvEvent(parentApp) {
    if ([configs.LEGACY, configs.LEGACY_WEBMOBILE].indexOf(parentApp) !== -1
      && window.parent.PRV) {
      window.parent.PRV.Event.emit('piframe_cvv_help');
    } else {
      window.parent.postMessage('piframe_cvv_help', '*');
    }
  },
};

export default EventEmitterHelper;
