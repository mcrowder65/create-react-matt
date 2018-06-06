import { SET_INPUT, SET_PING } from "./types";

export const setInput = input => {
  return {
    type: SET_INPUT,
    input
  };
};
export const setPing = ping => ({ type: SET_PING, ping });