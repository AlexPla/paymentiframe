import * as actions from '.';
import * as constants from '../constants/actionTypes';

describe('actions', () => {
  it('should create an action to update fields values', () => {
    const newState = {
      card_number: '1',
      card_type: {}
    }
    const expectedAction = {
      type: constants.UPDATE_FIELDS,
      newState
    }
    expect(actions.updateFields(newState)).toEqual(expectedAction)
  })
})