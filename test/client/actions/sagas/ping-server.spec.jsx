import {call, put} from "redux-saga/effects";

import {setPing} from "../../../../src/client/actions/index";
import {apiCall, pingServer} from "../../../../src/client/actions/sagas/ping-server";

describe("test/client/actions/sagas/ping-server.spec.jsx", () => {
  describe("pingServer", () => {

    test("success", () => {
      const iter = pingServer();
      const ping = "hello";
      expect(iter.next().value).toEqual(call(apiCall));
      expect(iter.next(ping).value).toEqual(put(setPing(ping)));
      expect(iter.next().done).toEqual(true);
    });
    test("catch", () => {
      const iter = pingServer();
      const e = new Error("hello!");
      expect(iter.next().value).toEqual(call(apiCall));
      expect(iter.throw(e).value).toEqual(put(setPing(e.message)));
      expect(iter.next().done).toEqual(true);
    });
  });

});