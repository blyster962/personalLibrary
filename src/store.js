import * as c from './constants';

const initialState = {
  search: {
    criteria: { read: 'No' },
    list: []
  }
};

function search (state, action){
  // TODO: Code to go to server to get data.

  // This code goes away when linked to server
  var list = [{id: 1, title: 'Tarzan'}, {id: 2, title: '20000 Leagues'}, {id: 3, title: 'Huckleberry Finn'}];

  var newState;
  newState.search.criteria = action.criteria;
  newState.search.list = list;
  return newState;
}

export default (state = initialState, action) => {
  switch (action.type){
    case c.FORM_SEARCH:
      return search(state, action);
    case c.FORM_RESET:
      return initialState;
    default:
      return state;
  }
}
