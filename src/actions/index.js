import { UPDATE_FIELDS, UPDATE_ERRORS } from '@Constants/actionTypes';

export function updateFields(newState) {
  return {
    type: UPDATE_FIELDS,
    newState,
  };
}

export function updateErrors({ key, value }) {
  return {
    type: UPDATE_ERRORS,
    key,
    value,
  };
}
