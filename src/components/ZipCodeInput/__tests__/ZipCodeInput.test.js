import React from 'react';
import { shallow } from 'enzyme';
import copies from '@Copies/zipCodeInput';
import ZipCodeInput from '../ZipCodeInput';

describe('Component ZipCodeInput:', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<ZipCodeInput parentApp="legacy" updateFields={jest.fn()} updateErrors={jest.fn()} value="" />);
  });

  it('should mount', () => {
    expect(wrapper).toBeDefined();
  });

  /*
  * SUCCESS
  */
  it('should process correct input', () => {
    wrapper.find('.zip-code__input').prop('onInput')({ target: { value: '01020' } });
    wrapper.update();
    expect(wrapper.state('errorMessage')).toEqual('');
    expect(wrapper.find('.zip-code__error').length).toEqual(0);
  });

  /*
  * ERRORS
  */
  it('should process incorrect input -> empty', () => {
    // To enable error message display we must have a min-length input first
    wrapper.find('.zip-code__input').prop('onInput')({ target: { value: '01020' } });
    // Actual input
    wrapper.find('.zip-code__input').prop('onInput')({ target: { value: '' } });
    wrapper.update();
    expect(wrapper.state('errorMessage')).toEqual('');
    expect(wrapper.find('.zip-code__error').length).toEqual(0);
  });

  it('should process incorrect input -> minLength', () => {
    // To enable error message display we must have a min-length input first
    wrapper.find('.zip-code__input').prop('onInput')({ target: { value: '01020' } });
    // Actual input
    wrapper.find('.zip-code__input').prop('onInput')({ target: { value: '0102' } });
    wrapper.update();
    expect(wrapper.state('errorMessage')).toEqual(copies.errors.minLength);
    expect(wrapper.find('.zip-code__error').length).toEqual(1);
  });

  /*
  * CLEAR INPUT
  */
  it('should clear input on button click', () => {
    // To enable the button we must enter some input
    wrapper.setProps({ value: '0' });
    expect(wrapper.find('.zip-code__clear-button').length).toEqual(1);
    wrapper.find('.zip-code__clear-button').prop('onMouseDown')();
    // Click changes app state and passes it as props
    wrapper.setProps({ value: '' });
    expect(wrapper.state('errorMessage')).toEqual('');
    expect(wrapper.state('errorDisabled')).toEqual(false);
    expect(wrapper.find('.zip-code__input').props().value).toEqual('');
    expect(wrapper.find('.zip-code__error').length).toEqual(0);
  });

  /*
  * BLUR
  */
  it('should show error message on lose of focus', () => {
    // To enable the button we must enter some input
    wrapper.setProps({ value: '12' });
    wrapper.find('.zip-code__input').prop('onBlur')();
    wrapper.update();
    expect(wrapper.state('errorMessage')).toEqual(copies.errors.minLength);
    expect(wrapper.state('errorDisabled')).toEqual(false);
    expect(wrapper.find('.zip-code__input').props().value).toEqual('12');
    expect(wrapper.find('.zip-code__error').length).toEqual(1);
  });

  /*
  * MAX LENGTH
  */
  it('should not allow more input when full-length reached', () => {
    // To enable the button we must enter some input
    wrapper.setProps({ value: '0123456789' });
    wrapper.find('.zip-code__input').prop('onInput')({ target: { value: '01234567890' } });
    wrapper.update();
    expect(wrapper.find('.zip-code__input').props().value).toEqual('0123456789');
  });
});
