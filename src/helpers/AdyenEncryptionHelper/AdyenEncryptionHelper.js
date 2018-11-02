import * as CONFIG from '@Constants/configs';

export default {
  isNode: typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node !== 'undefined',

  /**
   * Dynamically load Adyen encryption scripts and append it to body,
   * @return {Promise} resolve { Error }
   */
  downloadAdyenEncryptionScript(prod) {
    return new Promise((resolve, reject) => {
      if (!this.isNode) {
        const url = prod ? CONFIG.ADYEN_SCRIPT_URL_PROD : CONFIG.ADYEN_SCRIPT_URL_TEST;
        const scriptTag = document.querySelector(`script[src="${url}"]`); // todo: check to remove
        if (scriptTag) scriptTag.parentElement.removeChild(scriptTag); // todo: check to remove
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => {
          resolve(null);
        };
        script.onerror = (error) => {
          reject(error);
        };
        setTimeout(() => {
          reject(new Error(CONFIG.ADYEN_ERROR_TIMEOUT));
        }, CONFIG.ADYEN_DOWNLOAD_TIMEOUT);
        document.body.appendChild(script);
      } else {
        reject(new Error(CONFIG.ADYEN_ERROR_ENVIRONMENT));
      }
    });
  },

  /**
   * Protect card data with Adyen client side encryption,
   * @return {Promise} resolved with encrypted card data and error [{String | Boolean}, {Error}]
   */
  async encrypt(prod, number, cvc, holderName, expiryMonth, expiryYear) {
    try {
      if (typeof window.adyen === 'undefined') await this.downloadAdyenEncryptionScript(prod);
      const generationtime = new Date().toISOString();
      const cardData = {
        number, cvc, holderName, expiryMonth, expiryYear, generationtime,
      };
      const key = prod ? CONFIG.ADYEN_CLIENT_KEY_PROD : CONFIG.ADYEN_CLIENT_KEY_TEST;
      const cseInstance = window.adyen.encrypt.createEncryption(key, {});
      return [cseInstance.encrypt(cardData), null];
    } catch (error) {
      if (!this.isNode) console.error(error);
      return [false, error];
    }
  },
};
