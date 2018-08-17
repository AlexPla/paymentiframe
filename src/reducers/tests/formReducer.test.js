import formReducer from '../formReducer';
import { UPDATE_FIELDS } from '@Constants/actionTypes';

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
        type: UPDATE_FIELDS,
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
