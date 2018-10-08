import EventEmitterHelper from '../EventEmitterHelper';

describe('Helper EventEmitterHelper: ', () => {
  let spy;

  it('should send cvv event', () => {
    spy = jest.spyOn(window.parent, 'postMessage');
    EventEmitterHelper.sendCvvEvent();
    expect(spy).toHaveBeenCalled();
  });

  it('should send change event', () => {
    spy = jest.spyOn(window.parent, 'postMessage');
    EventEmitterHelper.sendChangeEvent(true, {
      cardHolder: 'Holder',
      cardNumber: '0123456789',
      cardCVV: '123',
      cardExpirationMonth: '01',
      cardExpirationYear: '20',
      errors: [],
    }).then(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should send height event', () => {
    spy = jest.spyOn(window.parent, 'postMessage');
    EventEmitterHelper.sendHeightEvent(0);
    expect(spy).toHaveBeenCalled();
  });
});
