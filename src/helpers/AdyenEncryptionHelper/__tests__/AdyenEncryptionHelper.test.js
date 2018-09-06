const mockedConfig = {
  ADYEN_DOWNLOAD_TIMEOUT: 100,
  ADYEN_SCRIPT_URL: 'url',
  ADYEN_CLIENT_KEY: '1',
  ADYEN_ERROR_ENVIRONMENT: 'err_env',
  ADYEN_ERROR_TIMEOUT: 'err_timeout',
};

const mockedAdyen = {
  encrypt: {
    createEncryption: () => ({
      encrypt: () => 'encrypted string',
    }),
  },
};

const mockedEncryptedResponceOk = ['encrypted string', null];
const mockedEncryptedResponceKo = [false, new Error(mockedConfig.ADYEN_ERROR_ENVIRONMENT)];

jest.mock('@Constants/configs', () => (mockedConfig));

const AdyenEncryptionHelper = require('../AdyenEncryptionHelper').default;

describe('Adyen encryption helper:', () => {
  let helper;

  beforeEach(() => {
    helper = { ...AdyenEncryptionHelper };
    window.adyen = undefined;
  });

  it('should call download adyen encryption script if it is not exist in global window', () => {
    helper.downloadAdyenEncyprionScript = () => {};
    const downloadAdyen = jest.spyOn(helper, 'downloadAdyenEncyprionScript');
    return helper.encrypt().then(() => {
      expect(downloadAdyen).toHaveBeenCalled();
    });
  });

  it('should not download adyen encryption script in node js environment', () => helper.downloadAdyenEncyprionScript().catch((error) => {
    expect(error.message).toBe(mockedConfig.ADYEN_ERROR_ENVIRONMENT);
  }));

  it('should reject downloading adyen script on timeout', () => {
    helper.isNode = false;
    return helper.downloadAdyenEncyprionScript().catch((error) => {
      expect(error.message).toBe(mockedConfig.ADYEN_ERROR_TIMEOUT);
    });
  }, mockedConfig.ADYEN_DOWNLOAD_TIMEOUT + 1);

  it('should reject downloading adyen script on Error', () => {
    helper.isNode = false;
    const customError = new Error('Custom error');
    setTimeout(() => {
      const scriptTag = document.querySelector(`script[src="${mockedConfig.ADYEN_SCRIPT_URL}"]`);
      scriptTag.onerror(customError);
    }, 10);
    return helper.downloadAdyenEncyprionScript().catch((error) => {
      expect(error).toBe(customError);
    });
  }, mockedConfig.ADYEN_DOWNLOAD_TIMEOUT + 1);

  it('should inject downloaded adyen encryption script in document body as a script node on success', () => {
    helper.isNode = false;
    setTimeout(() => {
      const scriptTag = document.querySelector(`script[src="${mockedConfig.ADYEN_SCRIPT_URL}"]`);
      scriptTag.onload();
    }, 10);
    return helper.downloadAdyenEncyprionScript().then(() => {
      const scriptTag = document.querySelector(`script[src="${mockedConfig.ADYEN_SCRIPT_URL}"]`);
      expect(scriptTag).not.toBeNull();
    });
  }, mockedConfig.ADYEN_DOWNLOAD_TIMEOUT + 1);

  it('should return encrypted data and null error in browser when adyen is downloaded and injected', () => {
    window.adyen = mockedAdyen;
    return expect(helper.encrypt()).resolves.toEqual(mockedEncryptedResponceOk);
  });

  it('should return false and error in Node.js environment', () => expect(helper.encrypt()).resolves.toEqual(mockedEncryptedResponceKo));

  it('should log error in Browser environment', () => {
    helper.isNode = false;
    const loggedError = jest.spyOn(console, 'error');
    return helper.encrypt().then(() => {
      expect(loggedError).toHaveBeenCalled();
    });
  });

  it('should use production encryption key when in production', () => {
    window.adyen = mockedAdyen;
    return expect(helper.encrypt(true)).resolves.toEqual(mockedEncryptedResponceOk);
  });
});
