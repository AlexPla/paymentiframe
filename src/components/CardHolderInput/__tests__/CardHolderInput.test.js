import React from 'react';
import { mount } from 'enzyme';
import CardHolderInput from '../CardHolderInput';

let component;
let input;
let updateFieldsMock;
let updateErrorsMock;

describe('Component CardHolderInput:', () => {
  beforeEach(() => {
    updateFieldsMock = jest.fn();
    updateErrorsMock = jest.fn();
    component = mount(<CardHolderInput
      lang="es"
      parentApp="storefront"
      updateFields={updateFieldsMock}
      updateErrors={updateErrorsMock}
      value=""
    />);
    input = component.find('.card-holder-input__input');
  });

  it('should mount', () => {
    expect(component).toBeDefined();
  });

  it('should call updateFields method from props and pass proper object with new field value as an argument', () => {
    input.prop('onInput')({
      target: {
        value: 'changed',
      },
    });
    expect(updateFieldsMock.mock.calls[0][0]).toEqual({ cardHolder: 'changed' });
  });

  it('should validate input on input and clear state.errorMessage for proper name', () => {
    input.prop('onInput')({
      target: {
        value: 'John Doe',
      },
    });
    component.update();
    expect(component.state('errorMessage')).toBe('');
  });

  it('should validate input on input and set state.errorMessage if holder name is empty', () => {
    input.prop('onInput')({
      target: {
        value: '',
      },
    });
    component.update();
    expect(component.state('errorMessage')).not.toBe('');
  });

  it('should validate input on input and set state.errorMessage if holder name length is less then 2 symbols', () => {
    input.prop('onInput')({
      target: {
        value: 'a',
      },
    });
    component.update();
    expect(component.state('errorMessage')).not.toBe('');
  });

  it('should validate input on input and set state.errorMessage if holder name length is more then 100 symbols', () => {
    input.prop('onInput')({
      target: {
        value: new Array(102).join('a'),
      },
    });
    component.update();
    expect(component.state('errorMessage')).not.toBe('');
  });

  it('should validate input on input and set state.errorMessage if holder name does not match validation pattern', () => {
    input.prop('onInput')({
      target: {
        value: '%!@#',
      },
    });
    component.update();
    expect(component.state('errorMessage')).not.toBe('');
  });

  it('should call updateErrorsMock with true error value if validation fails on user input', () => {
    input.prop('onInput')({
      target: {
        value: '%!@#',
      },
    });
    component.update();
    expect(updateErrorsMock.mock.calls[0][0]).toEqual({ key: 'cardHolder', value: true });
  });

  it('should call updateErrorsMock with false error value if validation pass on user input', () => {
    input.prop('onInput')({
      target: {
        value: 'John Doe',
      },
    });
    component.update();
    expect(updateErrorsMock.mock.calls[0][0]).toEqual({ key: 'cardHolder', value: false });
  });

  it('should not display clear button if input value is empty', () => {
    const clearButton = component.find('.card-holder-input__clear-button');
    expect(clearButton.length).toBe(0);
  });

  it('should display clear button if input value is not empty', () => {
    component.setProps({ value: 'John Doe' });
    component.update();
    const clearButton = component.find('.card-holder-input__clear-button');
    expect(clearButton.length).not.toBe(0);
  });

  it('should clear input on clear button click', () => {
    component.setProps({ value: 'John Doe' });
    component.update();
    const clearButton = component.find('.card-holder-input__clear-button');
    clearButton.prop('onClick')();
    expect(updateFieldsMock.mock.calls[0][0]).toEqual({ cardHolder: '' });
  });

  it('should set state.errorDisabled to false on clear button click', () => {
    component.setProps({ value: 'John Doe' });
    component.update();
    const clearButton = component.find('.card-holder-input__clear-button');
    clearButton.prop('onClick')();
    component.update();
    expect(component.state('errorDisabled')).toBe(false);
  });

  it('should set state.errorMessage with error for empty field on clear button click', () => {
    component.setProps({ value: 'John Doe' });
    component.update();
    const clearButton = component.find('.card-holder-input__clear-button');
    clearButton.prop('onClick')();
    component.update();
    expect(component.state('errorMessage')).not.toBe('');
  });

  it('should call updateErrorsMock method from props and pass proper object if validation fails on user input or clear button', () => {
    component.setProps({ value: 'John Doe' });
    component.update();
    const clearButton = component.find('.card-holder-input__clear-button');
    clearButton.prop('onClick')();
    component.update();
    expect(updateErrorsMock.mock.calls[0][0]).toEqual({ key: 'cardHolder', value: true });
  });

  it('should change state.errorDisabled to false on blur', () => {
    input.prop('onBlur')();
    component.update();
    expect(component.state('errorDisabled')).toBe(false);
  });

  it('should change trim input value on blur', () => {
    component.setProps({ value: 'John Doe ' });
    component.update();
    input.prop('onBlur')();
    expect(updateFieldsMock.mock.calls[0][0]).toEqual({ cardHolder: 'John Doe' });
  });
});
