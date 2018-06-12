import * as sagaTypes from "./types";
import { pingServer } from "./ping-server";
// The second argument of your value object can be method,
// where you can override takeEvery and do takeLatest instead
const sagaConfig = {
  [sagaTypes.PING_SERVER]: { generatorFunction: pingServer }
};

export default sagaConfig;
