import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import PaymentForm from './PaymentForm';

const mockStore = configureStore();

describe('Component PaymentForm:', () => {
  let wrapper;
  
  beforeEach(function () {
    let store = mockStore({});
    this.mainComponent = (<PaymentForm />);
    this.provider = (<Provider store={store}>{this.mainComponent}</Provider>);
    wrapper = shallow(this.provider, { lifecycleExperimental: true });
  });

  it('should mount', () => {
    expect(wrapper).toBeDefined();
  });
});