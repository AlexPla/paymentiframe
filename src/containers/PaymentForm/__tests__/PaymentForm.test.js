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
  let spy;

  beforeEach(() => {
    store = mockStore({});
    mainComponent = (<PaymentForm cardHolder="" cardNumber="" cardType={false} cardCVV="" zipCode="" cardExpirationMonth="" cardExpirationYear="" errors={[{ key: 'cardNumber', value: 'error' }]} />);
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

  it('should display ZipCodeInput if lang parameter is mx and card type is Amex and set error when prevZipError', () => {
    window.history.pushState({}, 'Test PaymentForm', `/${preUrl}/test?lang=${configs.MEXICO}`);
    wrapper = mount(provider, { lifecycleExperimental: true });
    const randomZipError = { key: 'zipCode', value: 'error' };
    wrapper.find('PaymentForm').instance().prevZipError = randomZipError;
    spy = jest.spyOn(wrapper.find('PaymentForm').instance(), 'componentDidUpdate');
    wrapper.setProps({
      children: React.cloneElement(wrapper.props().children, {
        errors: [],
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
    expect(spy).toBeCalled();
    expect(wrapper.find('.zip-code__input-group').length).toEqual(1);
  });

  it('should save previous zip error and update the errors if lang parameter is mx and card type changes from Amex to another', () => {
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
    wrapper.setProps({
      children: React.cloneElement(wrapper.props().children, {
        cardType: false,
      }),
    });
    expect(wrapper.find('PaymentForm').instance().prevZipError).toEqual({ key: 'zipCode', value: '' });
    expect(wrapper.find('.zip-code__input-group').length).toEqual(0);
  });

  it('should not display ZipCodeInput if lang parameter is not mx', () => {
    window.history.pushState({}, 'Test PaymentForm', `/${preUrl}/test?lang=${configs.SPAIN}`);
    wrapper = mount(provider, { lifecycleExperimental: true });
    expect(wrapper.find('.zip-code__input-group').length).toEqual(0);
  });

  it('should enter componentDidUpdate but not call sandChangeEvent', () => {
    window.history.pushState({}, 'Test PaymentForm', `/${preUrl}/test?app=${configs.LEGACY}`);
    wrapper = mount(provider, { lifecycleExperimental: true });
    spy = jest.spyOn(wrapper.find('PaymentForm').instance(), 'componentDidUpdate');
    wrapper.setProps({
      children: React.cloneElement(wrapper.props().children, { cardNumber: '5', errors: [{ key: 'cardNumber', value: 'error' }] }),
    });
    expect(spy).toBeCalled();
  });

  it('should enter componentDidUpdate and call sendChangeEvent', () => {
    window.history.pushState({}, 'Test PaymentForm', `/${preUrl}/test?app=${configs.LEGACY}`);
    wrapper = mount(provider, { lifecycleExperimental: true });
    spy = jest.spyOn(wrapper.find('PaymentForm').instance(), 'componentDidUpdate');
    wrapper.setProps({
      children: React.cloneElement(wrapper.props().children, { errors: [] }),
    });
    expect(spy).toBeCalled();
  });

  it('should enter componentDidUpdate and call sendChangeEvent, some errors exist', () => {
    window.history.pushState({}, 'Test PaymentForm', `/test?app=${configs.LEGACY}`);
    wrapper = mount(provider, { lifecycleExperimental: true });
    spy = jest.spyOn(wrapper.find('PaymentForm').instance(), 'componentDidUpdate');
    wrapper.setProps({
      children: React.cloneElement(wrapper.props().children, { errors: [{ key: 'cardNumber', value: 'error2' }] }),
    });
    expect(spy).toBeCalled();
  });

  it('should give focus to expiration date when focusExpDate called', () => {
    spy = jest.spyOn(wrapper.find('.card-exp-date__input').instance(), 'focus');
    wrapper.find('CardNumberInput').prop('focusExpDate')();
    expect(spy).toBeCalled();
  });

  it('should give focus to cvv when focusExpDatesNext called', () => {
    spy = jest.spyOn(wrapper.find('.card-cvv-input__input').instance(), 'focus');
    wrapper.find('CardExpDateInput').prop('focusExpDatesNext')();
    expect(spy).toBeCalled();
  });

  it('should give focus to zip code when cardType is amex, lang is mx and focusExpDatesNext called', () => {
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
    spy = jest.spyOn(wrapper.find('.zip-code__input').instance(), 'focus');
    wrapper.find('CardExpDateInput').prop('focusExpDatesNext')();
    expect(spy).toBeCalled();
  });

  it('should mount and send height event when document.fonts available', () => {
    window.history.pushState({}, 'Test PaymentForm', `/${preUrl}/test?app=${configs.LEGACY}&lang=${configs.ITALY}`);
    wrapper = mount(provider, { lifecycleExperimental: true });
    spy = jest.spyOn(wrapper.find('PaymentForm').instance(), 'sendHeightEvent');
    document.fonts = {
      ready: new Promise((resolve) => {
        resolve();
        expect(spy).toBeCalled();
      }),
    };
    wrapper.find('PaymentForm').instance().componentDidMount();
  });
});
