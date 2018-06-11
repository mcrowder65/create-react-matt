import React from "react";
import { mount } from "enzyme";
import createSagaMiddleware, { delay } from "redux-saga";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import fetchMock from "fetch-mock";

import initialState from "reducers/initial-state";
import rootReducer from "reducers/index";
import Home from "components/home";
import sagaActions from "actions/sagas";

const generateEvent = value => ({ target: { value } });
describe("test/client/components/home.spec.jsx", () => {
  let home;
  let store;
  beforeAll(() => {
    store = createStore(rootReducer, initialState);
    home = mount(
      <Provider store={store}>
        <Home/>
      </Provider>
    );
  });
  test("input", () => {
    home.find("#input").props().onChange(generateEvent("hello"));
    expect(store.getState().input).toEqual("hello");
  });
});

describe("full suite around", () => {
  test("when putting in an input, it should appear as the ping", async () => {
    const sagaMiddleware = createSagaMiddleware();

    const store = createStore(rootReducer, initialState, compose(applyMiddleware(sagaMiddleware)));
    sagaMiddleware.run(sagaActions);
    const home = mount(
      <Provider store={store}>
        <Home/>
      </Provider>
    );

    home.find("#input").props().onChange(generateEvent("hello"));
    expect(store.getState().input).toEqual("hello");
    const response = "hello";
    fetchMock.mock("http://localhost:3000/ping", response);
    home.find("#ping-server").props().onClick();
    await delay(1000);
    home.update();
    expect(home.find("#ping").text()).toEqual(response);
    fetchMock.restore();
  });
});