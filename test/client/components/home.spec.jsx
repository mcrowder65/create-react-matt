import React from "react";
import {mount} from "enzyme";
import {createStore} from "redux";
import {Provider} from "react-redux";

import initialState from "../../../src/client/reducers/initial-state";
import rootReducer from "../../../src/client/reducers/index";
import Home from "../../../src/client/components/home";

const generateEvent = value => ({target: {value}});
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