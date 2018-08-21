import * as constants from '@Constants/actionTypes';

const initialState = {
  cardHolder: '',
  cardNumber: '',
  cardType: false,
  cardExpirationMonth: '',
  cardExpirationYear: '',
  cardCVV: '',
  errors: {
    cardHolder: true,
    cardNumber: true,
    cardExpiration: true,
    cardCVV: true,
  },
};

export default function (state = initialState, action) {
  let nextState;
  const newErrors = {};

  switch (action.type) {
    case constants.UPDATE_FIELDS:
      nextState = Object.assign({}, state, action.newState);
      break;
    case constants.UPDATE_ERRORS:
      newErrors[action.key] = action.value;
      Object.assign({}, state.errors, newErrors);
      nextState = Object.assign({}, state, { errors: newErrors });
      break;
    default:
      nextState = state;
      break;
  }

  /* istanbul ignore next */
  if (process.title === 'browser') {
    console.groupCollapsed(`REDUX Action: ${action.type}`);
    console.info('Current State: ', state);
    console.info('Action: ', action);
    console.info('Next State: ', nextState);
    console.groupEnd();
  }

  return nextState;
}
