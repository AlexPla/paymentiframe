import EventEmitterHelper from '../EventEmitterHelper';

describe('Helper EventEmitterHelper: ', () => {
  it('should send cvv event', () => {
    const spy = jest.spyOn(window.parent, 'postMessage');
    EventEmitterHelper.sendCvvEvent();
    expect(spy).toHaveBeenCalled();
  });

  it('should send change event', () => {
    const spy = jest.spyOn(window.parent, 'postMessage');
    EventEmitterHelper.sendChangeEvent(true, { cardNumber: '0123456789' });
    expect(spy).toHaveBeenCalled();
  });

  it('should send height event', () => {
    const spy = jest.spyOn(window.parent, 'postMessage');
    EventEmitterHelper.sendHeightEvent(0);
    expect(spy).toHaveBeenCalled();
  });
});
