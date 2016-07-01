import * as c from './constants';

export function search(state){
  return dispatch => dispatch({
    type: c.FORM_SEARCH,
    state
  });
}

export function reset(){
  return dispatch => dispatch({
    type: c.FORM_RESET
  });
}
