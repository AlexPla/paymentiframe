import { UPDATE_FIELDS, UPDATE_ERRORS } from '../constants/actionTypes';

const initialState = {
  card_holder: '',
  card_number: '',
  card_type: false,
  card_expiration_month: '',
  card_expiration_year: '',
  card_cvv: '',
  errors: {
    card_holder: true,
    card_number: true,
    card_expiration: true,
    card_cvv: true
  }
};

export default function(state = initialState, action) {

  let nextState;

  switch (action.type) {
    case UPDATE_FIELDS:
      nextState = Object.assign({}, state, action.newState);
      break;
    case UPDATE_ERRORS:
      let newErrors = {};
      newErrors[action.key] = action.value;
      Object.assign({}, state.errors, newErrors);
      nextState = Object.assign({}, state, { errors: newErrors });
      break;
    default:
      nextState = state;
      break;
  }

  if (process.title === "browser") {
    console.groupCollapsed(`REDUX Action: ${action.type}`);
    console.info(`Current State: `, state);
    console.info(`Action: `, action);
    console.info(`Next State: `, nextState);
    console.groupEnd();
  }

  return nextState;
}
