import * as constants from '../constants/actionTypes';

export function updateFields(newState) {
  return {
    type: constants.UPDATE_FIELDS,
    newState
  };
}

export function updateErrors({ key, value }) {
  return {
    type: constants.UPDATE_ERRORS,
    key,
    value
  }
}