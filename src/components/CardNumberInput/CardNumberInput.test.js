import React from 'react';
import { shallow } from 'enzyme';
import CardNumberInput from './CardNumberInput';

describe('Component CardNumberInput:', () => {
  const wrapper = shallow(<CardNumberInput lang={ 'es' } updateFields={ jest.fn() } updateErrors={ jest.fn() } value={ '' } cardType={ {} }/>);

  it('should mount', () => {
    expect(wrapper).toBeDefined();
  });
});