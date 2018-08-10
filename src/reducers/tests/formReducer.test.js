import formReducer from '../formReducer';
import * as constants from '../../constants/actionTypes';

describe('form reducer', () => {
  it('should return the initial state', () => {
    expect(formReducer(undefined, {})).toEqual({
        card_holder: '',
        card_number: '',
        card_type: false,
        card_expiration_year: '',
        card_expiration_month: '',
        card_cvv: '',
        errors: {
          card_holder: true,
          card_number: true,
          card_expiration: true,
          card_cvv: true
        }
      }
    );
  });

  it('should handle UPDATE_FIELDS', () => {
    expect(
      formReducer({}, {
        type: constants.UPDATE_FIELDS,
        newState: { 
          card_number: '1',
          card_type: {}
        }
      })
    ).toEqual({
        card_number: '1',
        card_type: {}
      }
    );
  });
})