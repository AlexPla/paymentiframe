import { ADYEN_SCRIPT_URL, ADYEN_CLIENT_KEY } from '@Constants/configs';

export default {
  /**
   * Dynamically load Adyen encryption scripts and append it to body,
   * @return {Promise}
   */
  downloadAdyenEncyprionScript() {
    return new Promise((resolve, reject) => {
      if (typeof document !== 'undefined') {
        const scriptTag = document.querySelector(`script[src="${ADYEN_SCRIPT_URL}"]`);
        if (scriptTag) scriptTag.parentElement.removeChild(scriptTag);
        const script = document.createElement('script');
        script.src = ADYEN_SCRIPT_URL;
        script.onload = () => {
          resolve();
        };
        script.onerror = (err) => {
          reject(err);
        };
        document.body.appendChild(script);
      } else {
        reject();
      }
    });
  },

  /**
   * Protect card data with Adyen client side encryption,
   * @return {Promise} with encrypted card data (card_encrypted_json)
   */
  async encrypt(number, cvc, holderName, expiryMonth, expiryYear) {
    if (process.title !== 'browser') throw new Error('Adyen client side encryption is supported by browsers only');
    if (typeof window.adyen === 'undefined') await this.downloadAdyenEncyprionScript();
    const generationtime = new Date().toISOString();
    const cardData = {
      number, cvc, holderName, expiryMonth, expiryYear, generationtime,
    };
    const cseInstance = window.adyen.encrypt.createEncryption(ADYEN_CLIENT_KEY, {});
    return cseInstance.encrypt(cardData);
  },
};
