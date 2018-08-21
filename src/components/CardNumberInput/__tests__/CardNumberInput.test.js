import React from 'react';
import { shallow } from 'enzyme';
import * as constants from '@Constants/creditCard';
import copies from '@Copies/cardNumberInput';
import CardNumberInput from '../CardNumberInput';

describe('Component CardNumberInput:', () => {
  let wrapper;
  const lang = 'es';
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

  beforeEach(() => {
    wrapper = shallow(<CardNumberInput lang="es" updateFields={jest.fn()} updateErrors={jest.fn()} value="" cardType={cardType} />);
  });

  it('should mount', () => {
    expect(wrapper).toBeDefined();
  });

  /*
  * SUCCESS
  */
  it('should process correct input', () => {
    wrapper.find('.card-number__input').prop('onInput')({ target: { value: '5585 5585 5535 5585' } });
    wrapper.update();
    expect(wrapper.state('errorMessage')).toEqual('');
    expect(wrapper.find('.card-number__error').length).toEqual(0);
  });

  /*
  * ERRORS
  */
  it('should process incorrect input -> empty', () => {
    // To enable error message display we must have a full-length input first
    wrapper.find('.card-number__input').prop('onInput')({ target: { value: '5585 5585 5535 5585' } });
    // Actual input
    wrapper.find('.card-number__input').prop('onInput')({ target: { value: '' } });
    wrapper.update();
    expect(wrapper.state('errorMessage')).toEqual(copies.errors.required[lang]);
    expect(wrapper.find('.card-number__error').length).toEqual(1);
  });

  it('should process incorrect input -> minLength', () => {
    // To enable error message display we must have a full-length input first
    wrapper.find('.card-number__input').prop('onInput')({ target: { value: '5585 5585 5535 5585' } });
    // Actual input
    wrapper.find('.card-number__input').prop('onInput')({ target: { value: '5585 5585 5535 5' } });
    wrapper.update();
    expect(wrapper.state('errorMessage')).toEqual(copies.errors.minLength[lang]);
    expect(wrapper.find('.card-number__error').length).toEqual(1);
  });

  it('should process incorrect input -> pattern', () => {
    wrapper.find('.card-number__input').prop('onInput')({ target: { value: '9999 9999 9999 9999' } });
    wrapper.update();
    expect(wrapper.state('errorMessage')).toEqual(copies.errors.pattern[lang]);
    expect(wrapper.find('.card-number__error').length).toEqual(1);
  });

  /*
  * CLEAR INPUT
  */
  it('should clear input on button click', () => {
    // To enable the button we must enter some input
    wrapper.setProps({ value: '5' });
    expect(wrapper.find('.card-number__clear-button').length).toEqual(1);
    wrapper.find('.card-number__clear-button').prop('onClick')();
    // Click changes app state and passes it as propsw
    wrapper.setProps({ value: '' });
    expect(wrapper.state('errorMessage')).toEqual(copies.errors.required[lang]);
    expect(wrapper.state('errorDisabled')).toEqual(false);
    expect(wrapper.find('.card-number__input').props().value).toEqual('');
    expect(wrapper.find('.card-number__error').length).toEqual(1);
  });

  /*
  * BLUR
  */
  it('should show error message on lose of focus', () => {
    // To enable the button we must enter some input
    wrapper.setProps({ value: '' });
    wrapper.find('.card-number__input').prop('onBlur')();
    wrapper.update();
    expect(wrapper.state('errorMessage')).toEqual(copies.errors.required[lang]);
    expect(wrapper.state('errorDisabled')).toEqual(false);
    expect(wrapper.find('.card-number__input').props().value).toEqual('');
    expect(wrapper.find('.card-number__error').length).toEqual(1);
  });

  /*
  * MAX LENGTH
  */
  it('should not allow more input when full-length reached', () => {
    // To enable the button we must enter some input
    wrapper.setProps({ value: '5585558555355585' });
    wrapper.find('.card-number__input').prop('onInput')({ target: { value: '5585 5585 5535 55850' } });
    wrapper.update();
    expect(wrapper.find('.card-number__input').props().value).toEqual('5585 5585 5535 5585');
  });
});