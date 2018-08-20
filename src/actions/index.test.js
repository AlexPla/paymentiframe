import * as actions from '.';
import * as constants from '../constants/actionTypes';

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
});
