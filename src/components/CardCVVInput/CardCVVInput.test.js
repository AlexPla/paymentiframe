import React from 'react';
import { configure, mount } from 'enzyme';
import toJson from "enzyme-to-json";
import Adapter from 'enzyme-adapter-react-16';

import CardCVVInput from './CardCVVInput';

configure({ adapter: new Adapter() });

let component, input, updateFieldsMock, updateErrorsMock;

describe('Component CardHolderInput:', () => {

  beforeEach(function () {
    updateFieldsMock = jest.fn();
    updateErrorsMock = jest.fn();
    component = mount(<CardCVVInput
      lang={ 'es' }
      updateFields={ updateFieldsMock }
      updateErrors={ updateErrorsMock }
      cardType={ false }
      value={ '' } />);
    input = component.find(".card-cvv-input__input");
  });

  it('should mount', () => {
    expect(component).toBeDefined();
  });

  it('should match snapshot', () => {
    expect(toJson(component, { mode: "deep" })).toMatchSnapshot();
  });

  it('should call updateFields method from props and pass proper object with new field value as an argument', () => {
    input.prop('onInput')({
      target: {
        value: "123"
      }
    });
    expect(updateFieldsMock.mock.calls[0][0]).toEqual({ cardCVV: '123' });
  });

  it('should validate input on input and clear state.errorMessage for proper name', () => {
    input.prop('onInput')({
      target: {
        value: "123"
      }
    });
    component.update();
    expect(component.state('errorMessage')).toBe('');
  });

  it('should validate input on input and set state.errorMessage if holder name is empty', () => {
    input.prop('onInput')({
      target: {
        value: ""
      }
    });
    component.update();
    expect(component.state('errorMessage')).not.toBe('');
  });


  it('should validate input on input and set state.errorMessage if cvv is less then should be', () => {
    input.prop('onInput')({
      target: {
        value: "12"
      }
    });
    component.update();
    expect(component.state('errorMessage')).not.toBe('');
  });

  it('should change cvv length according to card type', () => {
    component.setProps({
      cardType: {
        code: {
          name: "CID",
          size: 4
        }
      }
    });
    component.update();
    input.prop('onInput')({
      target: {
        value: "1234"
      }
    });
    component.update();
    expect(updateFieldsMock.mock.calls[0][0]).toEqual({ cardCVV: '1234' });
  });

  it('should call updateErrorsMock with false error value if validation pass on user input', () => {
    input.prop('onInput')({
      target: {
        value: "123"
      }
    });
    component.update();
    expect(updateErrorsMock.mock.calls[0][0]).toEqual({ key: 'cardCVV', value: false });
  });

  it('should not display clear button if input value is empty', () => {
    const clearButton = component.find('.card-cvv-input__clear-button');
    expect(clearButton.length).toBe(0);
  });

  it('should display clear button if input value is not empty', () => {
    component.setProps({ value: "123" });
    component.update();
    const clearButton = component.find('.card-cvv-input__clear-button');
    expect(clearButton.length).not.toBe(0);
  });

  it('should clear input on clear button click', () => {
    component.setProps({ value: "123" });
    component.update();
    const clearButton = component.find('.card-cvv-input__clear-button');
    clearButton.prop('onClick')();
    expect(updateFieldsMock.mock.calls[0][0]).toEqual({ cardCVV: '' });
  });

  it('should set state.errorDisabled to false on clear button click', () => {
    component.setProps({ value: "123" });
    component.update();
    const clearButton = component.find('.card-cvv-input__clear-button');
    clearButton.prop('onClick')();
    component.update();
    expect(component.state('errorDisabled')).toBe(false);
  });

  it('should set state.errorMessage with error for empty field on clear button click', () => {
    component.setProps({ value: "123" });
    component.update();
    const clearButton = component.find('.card-cvv-input__clear-button');
    clearButton.prop('onClick')();
    component.update();
    expect(component.state('errorMessage')).not.toBe('');
  });

  it('should call updateErrorsMock method from props and pass proper object if validation fails on user input or clear button', () => {
    component.setProps({ value: "123" });
    component.update();
    const clearButton = component.find('.card-cvv-input__clear-button');
    clearButton.prop('onClick')();
    component.update();
    expect(updateErrorsMock.mock.calls[0][0]).toEqual({ key: 'cardCVV', value: true });
  });

  it('should change state.errorDisabled to false on blur', () => {
    input.prop('onBlur')();
    component.update();
    expect(component.state('errorDisabled')).toBe(false);
  });
});
