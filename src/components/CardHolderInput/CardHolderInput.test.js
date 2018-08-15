import React from 'react';
import { configure, mount } from 'enzyme';
import toJson from "enzyme-to-json";
import Adapter from 'enzyme-adapter-react-16';

import CardHolderInput from './CardHolderInput';

configure({ adapter: new Adapter() });

let component, input, updateFieldsMock, updateErrorsMock;

describe('Component CardHolderInput:', () => {

  beforeEach(function () {
    updateFieldsMock = jest.fn();
    updateErrorsMock = jest.fn();
    component = mount(<CardHolderInput
      lang={ 'es' }
      updateFields={ updateFieldsMock }
      updateErrors={ updateErrorsMock }
      value={ '' } />);
    input = component.find(".card-holder-input__input");
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
        value: "changed"
      }
    });
    expect(updateFieldsMock.mock.calls[0][0]).toEqual({ card_holder: 'changed' });
  });

  it('\'should change state.errorDisabled to true on input', () => {
    component.setState({ errorMessage: 'errorMessage' });
    input.prop('onInput')({
      target: {
        value: "changed"
      }
    });
    component.update();
    expect(component.state('errorDisabled')).toBe(true);
  });

  it('should change state.errorDisabled to false on blur', () => {
    input.prop('onBlur')();
    component.update();
    expect(component.state('errorDisabled')).toBe(false);
  });

  it('should validate input on blur and clear state.errorMessage for proper name', () => {
    component.setProps({ value: 'John Doe' });
    input.prop('onBlur')();
    component.update();
    expect(component.state('errorMessage')).toBe('');
  });

  it('should validate input on blur and set state.errorMessage if holder name length is less then 2 symbols', () => {
    component.setProps({ value: 'a' });
    input.prop('onBlur')();
    component.update();
    expect(component.state('errorMessage')).not.toBe('');
  });

  it('should validate input on blur and set state.errorMessage if holder name length is more then 100 symbols', () => {
    component.setProps({ value: new Array(102).join('a') });
    input.prop('onBlur')();
    component.update();
    expect(component.state('errorMessage')).not.toBe('');
  });

  it('should validate input on blur and set state.errorMessage if holder name does not match validation pattern', () => {
    component.setProps({ value: "%!@#" });
    input.prop('onBlur')();
    component.update();
    expect(component.state('errorMessage')).not.toBe('');
  });

});

// console.log("Input debug: ||| ", input.debug());
// console.log("Input props: ||| ", input.props());
// console.log("Input state: ||| ", component.state());
