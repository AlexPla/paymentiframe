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
      errors: {
        cardHolder: true,
        cardNumber: true,
        cardExpiration: true,
        cardCVV: true,
      },
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
});
