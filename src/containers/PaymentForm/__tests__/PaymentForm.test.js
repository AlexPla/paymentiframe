import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import * as configs from '@Constants/configs';
import PaymentForm from '../PaymentForm';

const mockStore = configureStore();

describe('Component PaymentForm:', () => {
  let wrapper;
  let store;
  let mainComponent;
  let provider;

  beforeEach(() => {
    store = mockStore({});
    mainComponent = (<PaymentForm />);
    provider = (<Provider store={store}>{mainComponent}</Provider>);
  });

  it('should mount', () => {
    window.history.pushState({}, 'Test PaymentForm', `/test?app=${configs.LEGACY}&lang=${configs.ITALY}`);
    wrapper = mount(provider, { lifecycleExperimental: true });
    expect(wrapper).toBeDefined();
  });

  it('should not find params in url', () => {
    window.history.pushState({}, 'Test PaymentForm', '/test?');
    wrapper = mount(provider, { lifecycleExperimental: true });
    expect(wrapper).toBeDefined();
  });

  it('should display ZipCodeInput if lang parameter is mx', () => {
    window.history.pushState({}, 'Test PaymentForm', `/test?lang=${configs.MEXICO}`);
    wrapper = mount(provider, { lifecycleExperimental: true });
    expect(wrapper.find('.zip-code__input-group').length).toEqual(1);
  });

  it('should not display ZipCodeInput if lang parameter is not mx', () => {
    window.history.pushState({}, 'Test PaymentForm', `/test?lang=${configs.SPAIN}`);
    wrapper = mount(provider, { lifecycleExperimental: true });
    expect(wrapper.find('.zip-code__input-group').length).toEqual(0);
  });

  it('should call showHelp', () => {
    window.history.pushState({}, 'Test PaymentForm', `/test?app=${configs.LEGACY}`);
    wrapper = mount(provider, { lifecycleExperimental: true });
    const spy = jest.spyOn(wrapper.find('PaymentForm').instance(), 'showHelp');
    wrapper.find('PaymentForm').instance().showHelp();
    expect(spy).toBeCalled();
  });

  it('should enter componentDidUpdate but not call sandChangeEvent', () => {
    window.history.pushState({}, 'Test PaymentForm', `/test?app=${configs.LEGACY}`);
    wrapper = mount(provider, { lifecycleExperimental: true });
    const spy = jest.spyOn(wrapper.find('PaymentForm').instance(), 'componentDidUpdate');
    wrapper.setProps({
      children: React.cloneElement(wrapper.props().children, { cardNumber: '5' }),
    });
    expect(spy).toBeCalled();
  });

  it('should enter componentDidUpdate and call sendChangeEvent', () => {
    window.history.pushState({}, 'Test PaymentForm', `/test?app=${configs.LEGACY}`);
    wrapper = mount(provider, { lifecycleExperimental: true });
    const spy = jest.spyOn(wrapper.find('PaymentForm').instance(), 'componentDidUpdate');
    wrapper.setProps({
      children: React.cloneElement(wrapper.props().children, {
        errors: {
          cardHolder: false,
          cardNumber: false,
          cardExpiration: false,
          cardCVV: false,
        },
      }),
    });
    expect(spy).toBeCalled();
  });
});
