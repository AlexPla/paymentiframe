import { LEGACY, STOREFRONT } from '@Constants/configs';
import EventEmitterHelper from '../EventEmitterHelper';

describe('Helper EventEmitterHelper: ', () => {
  it('should send cvv event to Storefront', () => {
    const spy = jest.spyOn(window.parent, 'postMessage');
    EventEmitterHelper.sendCvvEvent(STOREFRONT);
    expect(spy).toHaveBeenCalled();
  });

  it('should send cvv event to Legacy', () => {
    window.parent.PRV = { Event: { emit: jest.fn() } };
    const spy = jest.spyOn(window.parent.PRV.Event, 'emit');
    EventEmitterHelper.sendCvvEvent(LEGACY);
    expect(spy).toHaveBeenCalled();
  });

  it('should send change event to Storefront', () => {
    const spy = jest.spyOn(window.parent, 'postMessage');
    EventEmitterHelper.sendChangeEvent(STOREFRONT, { cardNumber: '0123456789' });
    expect(spy).toHaveBeenCalled();
  });

  it('should send change event to Legacy', () => {
    window.parent.PRV = { Event: { emit: jest.fn() } };
    const spy = jest.spyOn(window.parent.PRV.Event, 'emit');
    return EventEmitterHelper.sendChangeEvent(LEGACY, { cardNumber: '0123456789' })
      .then(() => {
        expect(spy).toHaveBeenCalled();
      });
  });
});
