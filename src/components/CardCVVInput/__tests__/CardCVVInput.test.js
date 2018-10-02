import React from 'react';
import { configure, mount } from 'enzyme';
import copies from '@Copies/cardCVVInput';
import Adapter from 'enzyme-adapter-react-16';

import CardCVVInput from '../CardCVVInput';

configure({ adapter: new Adapter() });

describe('Component CardCVVInput:', () => {
  let component;
  let input;
  let updateFieldsMock;
  let updateErrorsMock;
  let showHelpMock;
  const lang = 'es';

  beforeEach(() => {
    updateFieldsMock = jest.fn();
    updateErrorsMock = jest.fn();
    showHelpMock = jest.fn();
    component = mount(<CardCVVInput
      lang="es"
      parentApp="storefront"
      updateFields={updateFieldsMock}
      updateErrors={updateErrorsMock}
      cardType={false}
      value=""
      showHelp={showHelpMock}
    />);
    input = component.find('.card-cvv-input__input');
  });

  it('should mount', () => {
    expect(component).toBeDefined();
  });

  it('should call updateFields method from props and pass proper object with new field value as an argument', () => {
    input.prop('onInput')({
      target: {
        value: '123',
      },
    });
    expect(updateFieldsMock.mock.calls[0][0]).toEqual({ cardCVV: '123' });
  });

  it('should not call updateFields method if input does not match pattern', () => {
    input.prop('onInput')({
      target: {
        value: 'a',
      },
    });
    expect(updateFieldsMock.mock.calls.length).toBe(0);
  });

  it('should validate input on input and clear state.errorMessage for proper name', () => {
    input.prop('onInput')({
      target: {
        value: '123',
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
    expect(component.state('errorMessage')).toBe(copies.errors.required[lang]);
  });


  it('should validate input on input and set state.errorMessage if cvv is less then should be', () => {
    input.prop('onInput')({
      target: {
        value: '12',
      },
    });
    component.update();
    expect(component.state('errorMessage')).not.toBe('');
  });

  it('should change cvv length according to card type', () => {
    component.setProps({
      cardType: {
        code: {
          name: 'CID',
          size: 4,
        },
      },
    });
    component.update();
    input.prop('onInput')({
      target: {
        value: '1234',
      },
    });
    component.update();
    expect(updateFieldsMock.mock.calls[0][0]).toEqual({ cardCVV: '1234' });
  });

  it('should call updateErrorsMock with false error value if validation pass on user input', () => {
    input.prop('onInput')({
      target: {
        value: '123',
      },
    });
    component.update();
    expect(updateErrorsMock.mock.calls[0][0]).toEqual({ key: 'cardCVV', value: '' });
  });

  it('should not set class in style if input is not empty', () => {
    component.setProps({
      value: '123',
    });
    component.update();
    const styleClass = component.find('.card-cvv-input__input__not-empty');
    expect(styleClass.length).toBe(1);
  });

  it('should display help button', () => {
    const helpButton = component.find('.card-cvv-input__help-button');
    expect(helpButton.length).not.toBe(0);
  });

  it('should call showHelp', () => {
    const helpButton = component.find('.card-cvv-input__help-button');
    helpButton.prop('onClick')();
    expect(showHelpMock).toBeCalled();
  });

  it('should change state.errorDisabled to false on blur', () => {
    component.setProps({ value: '123' });
    input.prop('onBlur')();
    component.update();
    expect(component.state('errorDisabled')).toBe(false);
  });

  it('should change state.errorDisabled to true on focus', () => {
    component.setState({ errorDisabled: false });
    input.prop('onFocus')();
    component.update();
    expect(component.state('errorDisabled')).toBe(true);
  });

  it('should change masked state on click on eye', () => {
    component.setProps({ value: '123' });
    component.setState({ masked: true });
    component.find('.card-cvv-input__show-button').prop('onClick')();
    component.update();
    expect(component.state('masked')).toBeFalsy();
  });

  /*
  * BLUR
  */
  it('should show error message on lose of focus', () => {
    // To enable the button we must enter some input
    component.setProps({ value: '12' });
    component.setState({ errorMessage: copies.errors.pattern[lang] });
    component.find('.card-cvv-input__input').prop('onBlur')();
    component.update();
    expect(component.state('errorDisabled')).toEqual(false);
    expect(component.find('.card-cvv-input__input').props().value).toEqual('12');
    expect(component.find('.card-cvv-input__error').length).toEqual(1);
  });
});
