import { call, put } from "redux-saga/effects";

import { setPing } from "../index";

export const apiCall = async () => {
  // this is up to you whether or not you want to implement this server...
  const res = await fetch("http://localhost:3000/ping", { method: "GET" });
  return res.text();
};

// eslint-disable-next-line
export function* pingServer() {
  try {
    const resp = yield call(apiCall);
    yield put(setPing(resp));
  } catch (e) {
    yield put(setPing(e.message));
  }
}
