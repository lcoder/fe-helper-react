import { useReducer, useCallback } from "react";

export default function useReactState(initialState) {
  const [state, dispatch] = useReducer(function reducer(state, newState) {
    return Object.assign({}, state, newState);
  }, initialState);
  const setState = useCallback(function setState(newState) {
    dispatch(newState || {});
  }, []);
  return [state, setState];
}
