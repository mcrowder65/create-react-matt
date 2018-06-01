#!/usr/bin/env node
"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var program = require("commander");

var _require = require("child_process"),
    exec = _require.exec;

var deps = {
  "dependencies": {
    "html-webpack-plugin": "^2.30.1",
    "prop-types": "^15.6.0",
    "react": "^15.6.2",
    "react-dom": "^15.6.2",
    "react-redux": "^5.0.6",
    "react-router": "^4.2.0",
    "react-router-dom": "^4.2.2",
    "redux": "^3.7.2",
    "redux-saga": "^0.16.0",
    "webpack": "^3.8.1",
    "webpack-dev-server": "^2.9.4"
  },
  "devDependencies": {
    "babel-core": "^6.26.0",
    "babel-eslint": "^8.0.2",
    "babel-jest": "^21.2.0",
    "babel-loader": "^7.1.2",
    "babel-plugin-transform-async-to-generator": "^6.24.1",
    "babel-plugin-transform-es2015-modules-umd": "^6.24.1",
    "babel-plugin-transform-object-rest-spread": "^6.26.0",
    "babel-polyfill": "^6.26.0",
    "babel-preset-env": "^1.7.0",
    "babel-preset-react": "^6.24.1",
    "css-loader": "^0.28.7",
    "enzyme": "^2.9.1",
    "eslint-config-mcrowder65": "latest",
    "jest": "^21.2.1",
    "react-addons-test-utils": "^15.6.2",
    "react-test-renderer": "^16.1.1",
    "style-loader": "^0.18.2"
  } };
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
    var dependencies, devDependencies, enterFolder;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            enterFolder = function enterFolder(str) {
              return "cd " + folder + " && " + str;
            };

            _context.prev = 1;
            _context.next = 4;
            return executeCommand("mkdir " + folder, "Created " + folder);

          case 4:
            _context.next = 6;
            return executeCommand(enterFolder("npm init " + folder + " -y"), "npm init done");

          case 6:
            dependencies = Object.entries(deps.dependencies).map(function (_ref2) {
              var _ref3 = (0, _slicedToArray3.default)(_ref2, 2),
                  dep = _ref3[0],
                  version = _ref3[1];

              return dep + "@" + version;
            }).join(" ");
            _context.next = 9;
            return executeCommand(enterFolder("npm install --save " + dependencies), "dependencies installed");

          case 9:
            devDependencies = Object.entries(deps.devDependencies).map(function (_ref4) {
              var _ref5 = (0, _slicedToArray3.default)(_ref4, 2),
                  dep = _ref5[0],
                  version = _ref5[1];

              return dep + "@" + version;
            }).join(" ");
            _context.next = 12;
            return executeCommand(enterFolder("npm install --save-dev " + devDependencies), "devDependencies installed");

          case 12:
            _context.next = 17;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](1);

            console.log("Something went wrong, sorry");

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined, [[1, 14]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}()).parse(process.argv);
