import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import * as configs from '@Constants/configs';
import * as constants from '@Constants/creditCard';
import PaymentForm from '../PaymentForm';

const mockStore = configureStore();

describe('Component PaymentForm:', () => {
  let wrapper;
  let store;
  let mainComponent;
  let provider;
  const preUrl = 'iframe-pci-es.privalia-test.com';

  beforeEach(() => {
    store = mockStore({});
    mainComponent = (<PaymentForm />);
    provider = (<Provider store={store}>{mainComponent}</Provider>);
  });

  it('should mount', () => {
    window.history.pushState({}, 'Test PaymentForm', `/${preUrl}/test?app=${configs.LEGACY}&lang=${configs.ITALY}`);
    wrapper = mount(provider, { lifecycleExperimental: true });
    expect(wrapper).toBeDefined();
  });

  it('should not find params in url', () => {
    window.history.pushState({}, 'Test PaymentForm', `/${preUrl}/test?`);
    wrapper = mount(provider, { lifecycleExperimental: true });
    expect(wrapper).toBeDefined();
  });

  it('should set prod to false when test url', () => {
    window.history.pushState({}, 'Test PaymentForm', '/urldepro.com');
    wrapper = mount(provider, { lifecycleExperimental: true });
    expect(wrapper.find('PaymentForm').instance().state.prod).toBe(true);
  });

  it('should display ZipCodeInput if lang parameter is mx and card type is Amex', () => {
    window.history.pushState({}, 'Test PaymentForm', `/${preUrl}/test?lang=${configs.MEXICO}`);
    wrapper = mount(provider, { lifecycleExperimental: true });
    wrapper.setProps({
      children: React.cloneElement(wrapper.props().children, {
        cardType: {
          niceType: 'American Express',
          type: constants.AMERICAN_EXPRESS,
          pattern: /^3[47]\d*$/,
          isAmex: true,
          gaps: [4, 10],
          lengths: [15],
          code: {
            name: constants.CID,
            size: 4,
          },
        },
      }),
    });
    expect(wrapper.find('.zip-code__input-group').length).toEqual(1);
  });

  it('should not display ZipCodeInput if lang parameter is not mx', () => {
    window.history.pushState({}, 'Test PaymentForm', `/${preUrl}/test?lang=${configs.SPAIN}`);
    wrapper = mount(provider, { lifecycleExperimental: true });
    expect(wrapper.find('.zip-code__input-group').length).toEqual(0);
  });

  it('should enter componentDidUpdate but not call sandChangeEvent', () => {
    window.history.pushState({}, 'Test PaymentForm', `/${preUrl}/test?app=${configs.LEGACY}`);
    wrapper = mount(provider, { lifecycleExperimental: true });
    const spy = jest.spyOn(wrapper.find('PaymentForm').instance(), 'componentDidUpdate');
    wrapper.setProps({
      children: React.cloneElement(wrapper.props().children, { cardNumber: '5' }),
    });
    expect(spy).toBeCalled();
  });

  it('should enter componentDidUpdate and call sendChangeEvent', () => {
    window.history.pushState({}, 'Test PaymentForm', `/${preUrl}/test?app=${configs.LEGACY}`);
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
