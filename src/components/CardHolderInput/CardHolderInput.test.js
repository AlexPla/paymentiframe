import React from 'react';
import { shallow } from 'enzyme';
import CardHolderInput from './CardHolderInput';

describe('Component CardNumberInput:', () => {
  const wrapper = shallow(<CardHolderInput lang={ 'es' } updateFields={ jest.fn() } updateErrors={ jest.fn() } value={ '' } cardType={ {} }/>);

  it('should mount', () => {
    expect(wrapper).toBeDefined();
  });
});