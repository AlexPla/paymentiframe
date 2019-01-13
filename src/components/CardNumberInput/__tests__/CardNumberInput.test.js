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
    wrapper = shallow(<CardNumberInput lang="es" parentApp="storefront" updateFields={jest.fn()} updateErrors={jest.fn()} focusExpDate={jest.fn()} value="" cardType={cardType} />);
  });

  it('should mount', () => {
    expect(wrapper).toBeDefined();
  });

  /*
  * SUCCESS
  */
  it('should process correct input', () => {
    wrapper.find('.card-number__input').prop('onChange')({ target: { value: '5585 5585 5585 5583' } });
    wrapper.update();
    expect(wrapper.state('errorMessage')).toEqual('');
    expect(wrapper.find('.card-number__error').length).toEqual(0);
  });

  /*
  * ERRORS
  */
  it('should process incorrect input -> empty', () => {
    // To enable error message display we must have a full-length input first
    wrapper.find('.card-number__input').prop('onChange')({ target: { value: '5585 5585 5585 5583' } });
    // Actual input
    wrapper.find('.card-number__input').prop('onChange')({ target: { value: '' } });
    wrapper.update();
    expect(wrapper.state('errorMessage')).toEqual(copies.errors.required[lang]);
  });

  it('should process incorrect input -> pattern', () => {
    wrapper.find('.card-number__input').prop('onChange')({ target: { value: '9999 9999 9999 9999' } });
    wrapper.update();
    expect(wrapper.state('errorMessage')).toEqual(copies.errors.pattern[lang]);
  });

  /*
  * CLEAR INPUT
  */
  it('should clear input on button click', () => {
    // To enable the button we must enter some input
    wrapper.setProps({ value: '5' });
    expect(wrapper.find('.card-number__clear-button').length).toEqual(1);
    wrapper.find('.card-number__clear-button').prop('onMouseDown')();
    // Click changes app state and passes it as propsw
    wrapper.setProps({ value: '' });
    expect(wrapper.state('errorMessage')).toEqual(copies.errors.required[lang]);
    expect(wrapper.state('errorDisabled')).toEqual(true);
    expect(wrapper.find('.card-number__input').props().value).toEqual('');
    expect(wrapper.find('.card-number__error').length).toEqual(0);
  });

  /*
  * FOCUS
  */
  it('should set state.errorDisabled to true on focus', () => {
    wrapper.setProps({ value: '9999' });
    wrapper.find('.card-number__input').prop('onFocus')();
    expect(wrapper.state('errorDisabled')).toBe(true);
  });

  /*
  * BLUR
  */
  it('should show error message on lose of focus', () => {
    // To enable the button we must enter some input
    wrapper.setProps({ value: '9999', cardType: false });
    wrapper.setState({ errorMessage: copies.errors.pattern[lang] });
    wrapper.find('.card-number__input').prop('onBlur')();
    wrapper.update();
    expect(wrapper.state('errorDisabled')).toEqual(false);
    expect(wrapper.find('.card-number__input').props().value).toEqual('9999');
    expect(wrapper.find('.card-number__error').length).toEqual(1);
  });

  /*
  * MAX LENGTH
  */
  it('should not allow more input when full-length reached', () => {
    // To enable the button we must enter some input
    wrapper.setProps({ value: '5585558555855583' });
    wrapper.find('.card-number__input').prop('onChange')({ target: { value: '5585 5585 5585 55830' } });
    wrapper.update();
    expect(wrapper.find('.card-number__input').props().value).toEqual('5585 5585 5585 5583');
  });
});
