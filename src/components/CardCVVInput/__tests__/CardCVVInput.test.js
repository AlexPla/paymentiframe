import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import CardCVVInput from '../CardCVVInput';

configure({ adapter: new Adapter() });

describe('Component CardHolderInput:', () => {
  let component;
  let input;
  let updateFieldsMock;
  let updateErrorsMock;
  let showHelpMock;

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
    expect(component.state('errorMessage')).not.toBe('');
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
    expect(updateErrorsMock.mock.calls[0][0]).toEqual({ key: 'cardCVV', value: false });
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
    input.prop('onBlur')();
    component.update();
    expect(component.state('errorDisabled')).toBe(false);
  });

  it('should load webmobile help button', () => {
    updateFieldsMock = jest.fn();
    updateErrorsMock = jest.fn();
    showHelpMock = jest.fn();
    component = mount(<CardCVVInput
      lang="es"
      parentApp="webmobile"
      updateFields={updateFieldsMock}
      updateErrors={updateErrorsMock}
      cardType={false}
      value=""
      showHelp={showHelpMock}
    />);

    expect(component.find('.card-cvv-input__help-button').text()).toEqual('¿Qué es?');
  });
});
