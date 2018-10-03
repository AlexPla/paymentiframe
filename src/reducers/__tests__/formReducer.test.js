import * as constants from '@Constants/actionTypes';
import formReducer from '../formReducer';

describe('form reducer', () => {
  it('should return the initial state', () => {
    expect(formReducer(undefined, {})).toEqual({
      cardHolder: '',
      cardNumber: '',
      cardType: false,
      cardExpirationYear: '',
      cardExpirationMonth: '',
      cardCVV: '',
      zipCode: '',
      errors: [],
    });
  });

  it('should handle INIT_ERRORS', () => {
    expect(
      formReducer(undefined, {
        type: constants.INIT_ERRORS,
        errors: [
          {
            key: 'cardHolder',
            value: 'error',
          },
          {
            key: 'cardNumber',
            value: 'error',
          },
          {
            key: 'cardExpDate',
            value: 'error',
          },
          {
            key: 'cardCVV',
            value: 'error',
          },
        ],
      }),
    ).toEqual({
      cardHolder: '',
      cardNumber: '',
      cardType: false,
      cardExpirationYear: '',
      cardExpirationMonth: '',
      cardCVV: '',
      zipCode: '',
      errors: [
        {
          key: 'cardHolder',
          value: 'error',
        },
        {
          key: 'cardNumber',
          value: 'error',
        },
        {
          key: 'cardExpDate',
          value: 'error',
        },
        {
          key: 'cardCVV',
          value: 'error',
        },
      ],
    });
  });

  it('should handle UPDATE_FIELDS', () => {
    expect(
      formReducer({}, {
        type: constants.UPDATE_FIELDS,
        newState: {
          cardNumber: '1',
          cardType: {},
        },
      }),
    ).toEqual({
      cardNumber: '1',
      cardType: {},
    });
  });

  it('should handle UPDATE_ERRORS with no prev error', () => {
    expect(
      formReducer({ errors: [] }, {
        type: constants.UPDATE_ERRORS,
        key: 'cardNumber',
        value: 'error',
      }),
    ).toEqual({
      errors: [
        {
          key: 'cardNumber',
          value: 'error',
        },
      ],
    });
  });

  it('should handle UPDATE_ERRORS with prev error', () => {
    expect(
      formReducer({ errors: [{ key: 'cardNumber', value: 'error' }] }, {
        type: constants.UPDATE_ERRORS,
        key: 'cardNumber',
        value: 'error2',
      }),
    ).toEqual({
      errors: [
        {
          key: 'cardNumber',
          value: 'error2',
        },
      ],
    });
  });

  it('should handle UPDATE_ERRORS from error to correct', () => {
    expect(
      formReducer({ errors: [{ key: 'cardNumber', value: 'error' }] }, {
        type: constants.UPDATE_ERRORS,
        key: 'cardNumber',
        value: '',
      }),
    ).toEqual({ errors: [] });
  });
});
