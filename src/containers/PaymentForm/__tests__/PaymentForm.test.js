import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
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
    window.history.pushState({}, 'Test PaymentForm', '/test?app=legacy&lang=it');
    wrapper = mount(provider, { lifecycleExperimental: true });
    expect(wrapper).toBeDefined();
  });

  it('should not find params in url', () => {
    window.history.pushState({}, 'Test PaymentForm', '/test?');
    wrapper = mount(provider, { lifecycleExperimental: true });
    expect(wrapper).toBeDefined();
  });
});
