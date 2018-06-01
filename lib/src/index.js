#!/usr/bin/env node
"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var program = require("commander");

var _require = require("child_process"),
    exec = _require.exec;

var executeCommand = function executeCommand(command, output) {
  return new Promise(function (resolve, reject) {
    try {
      exec(command, function (error, stdout) {
        if (error) {
          reject(error);
        } else {
          if (output) {
            console.log(output);
          }
          resolve(stdout);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
program.arguments("<folder>").action(function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(folder) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return executeCommand("mkdir " + folder, "Created " + folder);

          case 3:
            _context.next = 5;
            return executeCommand("cd " + folder, "cd'd into " + folder);

          case 5:
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);

            console.log("Something went wrong, sorry");

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 7]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}()).parse(process.argv);