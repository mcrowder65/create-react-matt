import { setInput } from "../../../src/client/actions/index";
import { SET_INPUT } from "../../../src/client/actions/types";

describe("src/client/actions/index.js", () => {
  describe("function setInput()", () => {
    test("test", () => {
      expect(setInput("hello")).toEqual({ type: SET_INPUT, input: "hello" });
    });
  });
});