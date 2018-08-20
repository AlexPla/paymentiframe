import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import PaymentForm from './PaymentForm';

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
    wrapper = shallow(provider, { lifecycleExperimental: true });
  });

  it('should mount', () => {
    expect(wrapper).toBeDefined();
  });
});
