import React from 'react';
import { shallow } from 'enzyme';
import * as constants from '@Constants/creditCard';
import CardNumberInput from './CardNumberInput';

describe('Component CardNumberInput:', () => {
  const cardType = {
    niceType: 'Maestro',
    type: constants.MAESTRO,
    pattern: '^((5((0|[6-9]))?)|(6|6[37]))$',
    gaps: [4, 8, 12],
    lengths: [12, 13, 14, 15, 16, 17, 18, 19],
    code: {
      name: constants.CVC,
      size: 3,
    },
  };
  const wrapper = shallow(<CardNumberInput lang="es" updateFields={jest.fn()} updateErrors={jest.fn()} value="" cardType={cardType} />);

  it('should mount', () => {
    expect(wrapper).toBeDefined();
  });
});
