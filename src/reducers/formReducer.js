import { UPDATE_FIELDS, UPDATE_ERRORS } from '../actions';

const initialState = {
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

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_FIELDS:
      return Object.assign({}, state, action.newState);
    case UPDATE_ERRORS:
      let newErrors = {};
      newErrors[action.key] = action.value;
      Object.assign(newErrors, state.errors, newErrors);
      return Object.assign({}, state, { errors: newErrors });
    default:
      return state;
  }
}