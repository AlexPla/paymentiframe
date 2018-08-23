import copies from '@Copies/zipCodeInput';
import ZipCodeHelper from '../ZipCodeHelper';

describe('Helper ZipCodeHelper: ', () => {
  it('should process correct zip', () => {
    const zip = ZipCodeHelper.extractValueFromVisualValue('12345');
    expect(zip).toEqual('12345');
  });

  it('should process incorrect zip', () => {
    const zip = ZipCodeHelper.extractValueFromVisualValue('!');
    expect(zip).toEqual('');
  });

  it('should validate correct zip', () => {
    const error = ZipCodeHelper.validateInput('12345');
    expect(error).toEqual('');
  });

  it('should validate incorrect zip -> empty', () => {
    const error = ZipCodeHelper.validateInput('');
    expect(error).toEqual(copies.errors.required);
  });

  it('should validate incorrect zip -> minLength', () => {
    const error = ZipCodeHelper.validateInput('1234');
    expect(error).toEqual(copies.errors.minLength);
  });
});
