import { LEGACY, STOREFRONT } from '@Constants/configs';
import EventEmitterHelper from '../EventEmitterHelper';

describe('Helper EventEmitterHelper: ', () => {
  it('should send event to Storefront', () => {
    const spy = jest.spyOn(window.parent, 'postMessage');
    EventEmitterHelper.sendCvvEvent(STOREFRONT);
    expect(spy).toHaveBeenCalled();
  });

  it('should send event to Legacy', () => {
    window.parent.PRV = { Event: { emit: jest.fn() } };
    const spy = jest.spyOn(window.parent.PRV.Event, 'emit');
    EventEmitterHelper.sendCvvEvent(LEGACY);
    expect(spy).toHaveBeenCalled();
  });
});
