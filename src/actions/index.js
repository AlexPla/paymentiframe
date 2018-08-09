export const UPDATE_FIELDS = 'UPDATE_FIELDS';
export const UPDATE_ERRORS = 'UPDATE_ERRORS';

export function updateFields(newState) {
  return {
    type: UPDATE_FIELDS,
    newState
  };
}

export function updateErrors({ key, value }) {
  return {
    type: UPDATE_ERRORS,
    key,
    value
  }
}