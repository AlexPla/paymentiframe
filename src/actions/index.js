import * as constants from '@Constants/actionTypes';

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

export function showHelp() {
  return {
    type: constants.SHOW_HELP,
  };
}
