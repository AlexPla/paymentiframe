import * as constants from '@Constants/actionTypes';

export function initErrors(errors) {
  return {
    type: constants.INIT_ERRORS,
    errors,
  };
}

export function updateFields(newState) {
  return {
    type: constants.UPDATE_FIELDS,
    newState,
  };
}

export function updateErrors({ key, value }) {
  return {
    type: constants.UPDATE_ERRORS,
    key,
    value,
  };
}
