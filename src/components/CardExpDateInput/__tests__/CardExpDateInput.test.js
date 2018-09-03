import React from 'react';
import { mount } from 'enzyme';
import copies from '@Copies/cardExpDateInput';
import CardExpDateInput from '../CardExpDateInput';

describe('Component CardExpDateInput:', () => {
  const initDate = { month: '', year: '' };
  const lang = 'es';
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<CardExpDateInput lang="es" parentApp="storefront" updateFields={jest.fn()} updateErrors={jest.fn()} value={initDate} />);
  });

  it('should mount', () => {
    expect(wrapper).toBeDefined();
  });

  /*
  * SUCCESS
  */
  it('should process correct input', () => {
    wrapper.find('.card-exp-date__input').prop('onInput')({ target: { value: '05 25' } });
    wrapper.update();
    expect(wrapper.state('errorMessage')).toEqual('');
    expect(wrapper.find('.card-exp-date__error').length).toEqual(0);
  });

  /*
  * ERRORS
  */
  it('should process incorrect input -> empty', () => {
    // To enable error message display we must have a full-length input first
    wrapper.find('.card-exp-date__input').prop('onInput')({ target: { value: '05 25' } });
    // Actual input
    wrapper.find('.card-exp-date__input').prop('onInput')({ target: { value: '' } });
    wrapper.update();
    expect(wrapper.state('errorMessage')).toEqual(copies.errors.required[lang]);
    expect(wrapper.find('.card-exp-date__error').length).toEqual(1);
  });

  it('should process incorrect input -> incomplete', () => {
    // To enable error message display we must have a full-length input first
    wrapper.find('.card-exp-date__input').prop('onInput')({ target: { value: '05 25' } });
    // Actual input
    wrapper.find('.card-exp-date__input').prop('onInput')({ target: { value: '05 1' } });
    wrapper.update();
    expect(wrapper.state('errorMessage')).toEqual(copies.errors.incomplete[lang]);
    expect(wrapper.find('.card-exp-date__error').length).toEqual(1);
  });

  it('should process incorrect input -> pattern', () => {
    wrapper.find('.card-exp-date__input').prop('onInput')({ target: { value: '35 25' } });
    wrapper.update();
    expect(wrapper.state('errorMessage')).toEqual(copies.errors.pattern[lang]);
    expect(wrapper.find('.card-exp-date__error').length).toEqual(1);
  });

  it('should process incorrect input -> posterior', () => {
    // Previous year
    wrapper.find('.card-exp-date__input').prop('onInput')({ target: { value: '01 00' } });
    wrapper.update();
    expect(wrapper.state('errorMessage')).toEqual(copies.errors.posterior[lang]);
    expect(wrapper.find('.card-exp-date__error').length).toEqual(1);
    // Same year
    wrapper.find('.card-exp-date__input').prop('onInput')({ target: { value: '01 18' } });
    wrapper.update();
    expect(wrapper.state('errorMessage')).toEqual(copies.errors.posterior[lang]);
    expect(wrapper.find('.card-exp-date__error').length).toEqual(1);
  });

  /*
  * CLEAR INPUT
  */
  it('should clear input on button click', () => {
    // To enable the button we must enter some input
    wrapper.setProps({ value: { month: '0', year: '' } });
    expect(wrapper.find('.card-exp-date__clear-button').length).toEqual(1);
    wrapper.find('.card-exp-date__clear-button').prop('onClick')();
    // Click changes app state and passes it as propsw
    wrapper.setProps({ value: initDate });
    expect(wrapper.state('errorMessage')).toEqual(copies.errors.required[lang]);
    expect(wrapper.state('errorDisabled')).toEqual(false);
    expect(wrapper.find('.card-exp-date__input').props().value).toEqual('');
    expect(wrapper.find('.card-exp-date__error').length).toEqual(1);
  });

  /*
  * BLUR
  */
  it('should show error message on lose of focus', () => {
    // To enable the button we must enter some input
    wrapper.setProps({ value: { month: '01', year: '00' } });
    wrapper.find('.card-exp-date__input').prop('onBlur')();
    wrapper.update();
    expect(wrapper.state('errorMessage')).toEqual(copies.errors.posterior[lang]);
    expect(wrapper.state('errorDisabled')).toEqual(false);
    expect(wrapper.find('.card-exp-date__input').props().value).toEqual('01 / 00');
    expect(wrapper.find('.card-exp-date__error').length).toEqual(1);
  });

  /*
  * MAX LENGTH
  */
  it('should not allow more input when full-length reached', () => {
    // To enable the button we must enter some input
    wrapper.setProps({ value: { month: '05', year: '25' } });
    wrapper.find('.card-exp-date__input').prop('onInput')({ target: { value: '05 / 254' } });
    wrapper.update();
    expect(wrapper.find('.card-exp-date__input').props().value).toEqual('05 / 25');
  });
});
