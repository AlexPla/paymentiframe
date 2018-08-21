import * as actions from '..';
import * as constants from '@Constants/actionTypes';

describe('actions', () => {
  it('should create an action to update fields values', () => {
    const newState = {
      cardNumber: '1',
      cardType: {},
    };
    const expectedAction = {
      type: constants.UPDATE_FIELDS,
      newState,
    };
    expect(actions.updateFields(newState)).toEqual(expectedAction);
  });

  it('should create an action to update an error value', () => {
    const pair = {
      key: 'cardHolder',
      value: true,
    };
    const expectedAction = Object.assign({}, pair, { type: constants.UPDATE_ERRORS });
    expect(actions.updateErrors(pair)).toEqual(expectedAction);
  });

  it('should create an action to send event to the parent', () => {
    const expectedAction = { type: constants.SHOW_HELP };
    expect(actions.showHelp()).toEqual(expectedAction);
  });
});
