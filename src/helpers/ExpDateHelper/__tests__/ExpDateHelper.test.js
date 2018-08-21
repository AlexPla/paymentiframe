import ExpDateHelper from '../ExpDateHelper';

describe('Helper ExpDateHelper: ', () => {
  it('should process correct date', () => {
    const date = ExpDateHelper.extractValueFromVisualValue('05 / 25');
    expect(date).toEqual({ month: '05', year: '25' });
  });

  it('should add 0 before month', () => {
    const date = ExpDateHelper.extractValueFromVisualValue('5');
    expect(date).toEqual({ month: '05', year: '' });
  });

  it('should process incorrect date', () => {
    const date = ExpDateHelper.extractValueFromVisualValue('a');
    expect(date).toEqual({ month: '', year: '' });
  });
});
