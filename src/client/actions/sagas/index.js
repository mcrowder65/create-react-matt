import { takeEvery } from "redux-saga/effects";

import config from "./config";

// eslint-disable-next-line
function* sagaActions() {
  const sagaTypes = Object.keys(config);
  // use for of for iterators
  for (const type of sagaTypes) {
    const sagaConfig = config[type];
    // by default, it does takeEvery, override this in the config file if desired
    yield (sagaConfig.method || takeEvery)(type, sagaConfig.generatorFunction);
  }
}

export default sagaActions;
