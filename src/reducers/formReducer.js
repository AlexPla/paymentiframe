import * as constants from '@Constants/actionTypes';

const initialState = {
  cardHolder: '',
  cardNumber: '',
  cardType: false,
  cardExpirationMonth: '',
  cardExpirationYear: '',
  cardCVV: '',
  zipCode: '',
  errors: [],
};

export default function (state = initialState, action) {
  let nextState;
  let prevErrorIndex;
  let newErrors;

  switch (action.type) {
    case constants.INIT_ERRORS:
      newErrors = action.errors.map(error => Object.assign({}, error));
      nextState = Object.assign({}, state, { errors: newErrors });
      break;
    case constants.UPDATE_FIELDS:
      nextState = Object.assign({}, state, action.newState);
      break;
    case constants.UPDATE_ERRORS:
      newErrors = state.errors.map(error => Object.assign({}, error));
      prevErrorIndex = newErrors.findIndex(error => error.key === action.key);
      if (prevErrorIndex === -1) {
        newErrors.push({ key: action.key, value: action.value });
      } else if (action.value) {
        newErrors[prevErrorIndex].value = action.value;
      } else {
        newErrors.splice(prevErrorIndex, 1);
      }
      nextState = Object.assign({}, state, { errors: newErrors });
      break;
    default:
      nextState = state;
      break;
  }

  return nextState;
}
