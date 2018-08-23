import copies from '@Copies/zipCodeInput';
import { ZIP_CODE_MIN_LENGTH } from '@Constants/creditCard';

const ZipCodeHelper = {
  extractValueFromVisualValue(value) {
    let result = value;
    [result] = new RegExp(/(\d|[a-zA-Z]|-)*/).exec(result);
    return result.toString();
  },

  validateInput(value) {
    let error = '';
    if (value.length === 0) {
      error = copies.errors.required;
    } else if (value.length < ZIP_CODE_MIN_LENGTH) {
      error = copies.errors.minLength;
    }
    return error;
  },
};

export default ZipCodeHelper;
