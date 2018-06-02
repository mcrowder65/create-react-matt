#!/usr/bin/env node
"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var program = require("commander");

var _require = require("child_process"),
    exec = _require.exec;

var ora = require("ora");
var fs = require("fs");

var deps = {
  "dependencies": {
    "babel-runtime": "^6.26.0",
    "html-webpack-plugin": "^2.30.1",
    "prop-types": "^15.6.0",
    "react": "^16.2.0",
    "react-dom": "^16.2.0",
    "react-redux": "^5.0.6",
    "react-router": "^4.2.0",
    "react-router-dom": "^4.2.2",
    "redux": "^3.7.2",
    "redux-saga": "^0.16.0",
    "webpack": "^3.8.1"
  },
  "devDependencies": {
    "babel-core": "^6.26.0",
    "babel-eslint": "^8.0.2",
    "babel-jest": "^21.2.0",
    "babel-loader": "^7.1.2",
    "babel-plugin-transform-async-to-generator": "^6.24.1",
    "babel-plugin-transform-es2015-modules-umd": "^6.24.1",
    "babel-plugin-transform-object-rest-spread": "^6.26.0",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-polyfill": "^6.26.0",
    "babel-preset-env": "^1.7.0",
    "babel-preset-react": "^6.24.1",
    "css-loader": "^0.28.7",
    "enzyme": "^3.3.0",
    "enzyme-adapter-react-16": "^1.1.1",
    "eslint-config-mcrowder65": "latest",
    "jest": "^21.2.1",
    "react-addons-test-utils": "^15.6.2",
    "react-test-renderer": "^16.1.1",
    "style-loader": "^0.18.2",
    "postcss-loader": "^2.1.5",
    "postcss-flexbugs-fixes": "^3.3.1",
    "sass-loader": "^7.0.1",
    "react-hot-loader": "^4.2.0",
    "webpack-dev-server": "^2.9.4"
  } };

var executeCommand = function executeCommand(command, loadingText) {
  var spinner = void 0;
  return new Promise(function (resolve, reject) {
    try {
      if (loadingText) {
        spinner = ora(loadingText).start();
      }
      exec(command, function (error, stdout) {
        if (error) {
          if (error.message.indexOf("File exists") !== -1) {
            spinner.fail(error.message);
            reject(error);
          } else {

            reject(error);
          }
        } else {
          if (loadingText) {
            spinner.succeed();
          }
          resolve(stdout);
        }
      });
    } catch (error) {
      if (loadingText) {
        spinner.fail();
      }
      reject(error);
    }
  });
};

var curlCmd = "curl -O https://raw.githubusercontent.com/mcrowder65/create-react-matt/master/";
program.arguments("<folder>").option("-y, --yarn", "Add yarn").option("-f, --force", "rm -rf's your folder for good measure").action(function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(folder) {
    var fixPackageJson = function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var pkgJson;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                pkgJson = require("./package.json");

                pkgJson.scripts.start = "webpack-dev-server";
                pkgJson.json = (0, _extends3.default)({}, pkgJson.json, {
                  "setupTestFrameworkScriptFile": "<rootDir>/test/client/config.jsx",
                  "moduleNameMapper": {
                    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
                    "\\.(css|scss|less)$": "identity-obj-proxy"
                  },
                  "coverageReporters": ["html"],
                  "globals": {
                    "localStorage": {}
                  }
                });
                _context.next = 5;
                return writeFile(folder + "/package.json", JSON.stringify(pkgJson));

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function fixPackageJson() {
        return _ref6.apply(this, arguments);
      };
    }();

    var scaffold = function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
        var createConfigs = function () {
          var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
            var configFetcher;
            return _regenerator2.default.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    configFetcher = fileGetter("");
                    _context2.next = 3;
                    return configFetcher(".babelrc");

                  case 3:
                    _context2.next = 5;
                    return configFetcher("webpack.config.js");

                  case 5:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));

          return function createConfigs() {
            return _ref8.apply(this, arguments);
          };
        }();

        var createSagas = function () {
          var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
            var sagaFetcher, sagaTestFetcher;
            return _regenerator2.default.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    sagaFetcher = fileGetter("src/client/actions/sagas");
                    _context3.next = 3;
                    return sagaFetcher("config.jsx");

                  case 3:
                    _context3.next = 5;
                    return sagaFetcher("index.jsx");

                  case 5:
                    _context3.next = 7;
                    return sagaFetcher("ping-server.jsx");

                  case 7:
                    _context3.next = 9;
                    return sagaFetcher("types.jsx");

                  case 9:
                    sagaTestFetcher = fileGetter("test/client/actions/sagas");
                    _context3.next = 12;
                    return sagaTestFetcher("ping-server.spec.jsx");

                  case 12:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3, this);
          }));

          return function createSagas() {
            return _ref9.apply(this, arguments);
          };
        }();

        var createActions = function () {
          var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
            var actionFetcher, actionTestFetcher;
            return _regenerator2.default.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    actionFetcher = fileGetter("src/client/actions");
                    _context4.next = 3;
                    return actionFetcher("index.jsx");

                  case 3:
                    _context4.next = 5;
                    return actionFetcher("types.jsx");

                  case 5:
                    actionTestFetcher = fileGetter("test/client/actions");
                    _context4.next = 8;
                    return actionTestFetcher("index.spec.jsx");

                  case 8:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee4, this);
          }));

          return function createActions() {
            return _ref10.apply(this, arguments);
          };
        }();

        var createComponents = function () {
          var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
            var componentFetcher, componentTestFetcher;
            return _regenerator2.default.wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    componentFetcher = fileGetter("src/client/components");
                    _context5.next = 3;
                    return componentFetcher("home.jsx");

                  case 3:
                    componentTestFetcher = fileGetter("test/client/components");
                    _context5.next = 6;
                    return componentTestFetcher("home.spec.jsx");

                  case 6:
                  case "end":
                    return _context5.stop();
                }
              }
            }, _callee5, this);
          }));

          return function createComponents() {
            return _ref11.apply(this, arguments);
          };
        }();

        var createReducers = function () {
          var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
            var reducerFetcher;
            return _regenerator2.default.wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    reducerFetcher = fileGetter("src/client/reducers");
                    _context6.next = 3;
                    return reducerFetcher("index.jsx");

                  case 3:
                    _context6.next = 5;
                    return reducerFetcher("initial-state.jsx");

                  case 5:
                  case "end":
                    return _context6.stop();
                }
              }
            }, _callee6, this);
          }));

          return function createReducers() {
            return _ref12.apply(this, arguments);
          };
        }();

        var createStyles = function () {
          var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
            var stylesFetcher;
            return _regenerator2.default.wrap(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    stylesFetcher = fileGetter("src/client/styles");
                    _context7.next = 3;
                    return stylesFetcher("base.css");

                  case 3:
                  case "end":
                    return _context7.stop();
                }
              }
            }, _callee7, this);
          }));

          return function createStyles() {
            return _ref13.apply(this, arguments);
          };
        }();

        var createClientFiles = function () {
          var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
            var clientFileFetcher, clientTestFileFetcher;
            return _regenerator2.default.wrap(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    clientFileFetcher = fileGetter("src/client");
                    _context8.next = 3;
                    return clientFileFetcher("app.jsx");

                  case 3:
                    _context8.next = 5;
                    return clientFileFetcher("index.html");

                  case 5:
                    _context8.next = 7;
                    return clientFileFetcher("router.jsx");

                  case 7:
                    clientTestFileFetcher = fileGetter("test/client");
                    _context8.next = 10;
                    return clientTestFileFetcher("config.jsx");

                  case 10:
                  case "end":
                    return _context8.stop();
                }
              }
            }, _callee8, this);
          }));

          return function createClientFiles() {
            return _ref14.apply(this, arguments);
          };
        }();

        var createFolderStructure = function () {
          var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
            return _regenerator2.default.wrap(function _callee9$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    _context9.next = 2;
                    return executeCommand(enterFolder("mkdir -p src/client/actions/sagas && mkdir -p src/client/components && mkdir -p src/client/reducers && mkdir -p src/client/styles"));

                  case 2:
                    _context9.next = 4;
                    return executeCommand(enterFolder("mkdir -p test/client/actions/sagas && mkdir -p test/client/components"));

                  case 4:
                  case "end":
                    return _context9.stop();
                }
              }
            }, _callee9, this);
          }));

          return function createFolderStructure() {
            return _ref15.apply(this, arguments);
          };
        }();

        var fileGetter;
        return _regenerator2.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                fileGetter = function fileGetter(filepath) {
                  return function (filename) {
                    executeCommand(enterFolder("" + curlCmd + filepath + "/" + filename, "/" + filepath));
                  };
                };

                _context10.next = 3;
                return createFolderStructure();

              case 3:
                _context10.next = 5;
                return createConfigs();

              case 5:
                _context10.next = 7;
                return createSagas();

              case 7:
                _context10.next = 9;
                return createActions();

              case 9:
                _context10.next = 11;
                return createComponents();

              case 11:
                _context10.next = 13;
                return createReducers();

              case 13:
                _context10.next = 15;
                return createStyles();

              case 15:
                _context10.next = 17;
                return createClientFiles();

              case 17:

                displaySuccessMessage("Files scaffolded and placed");

              case 18:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      return function scaffold() {
        return _ref7.apply(this, arguments);
      };
    }();

    var pkg, dependencies, devDependencies, displaySuccessMessage, enterFolder, install, writeFile;
    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            writeFile = function writeFile(filename, content) {
              return new Promise(function (resolve, reject) {
                try {
                  fs.writeFile(filename, content, function (error) {
                    if (error) {
                      console.log(error);
                      reject(error);
                    } else {
                      resolve();
                    }
                  });
                } catch (error) {
                  console.log(error);
                  reject(error);
                }
              });
            };

            install = function install() {
              return program.yarn ? "yarn add" : "npm install";
            };

            enterFolder = function enterFolder(str, post) {
              return "cd " + folder + (post ? post : "") + " && " + str;
            };

            displaySuccessMessage = function displaySuccessMessage(message) {
              var spinner = ora(message).start();
              spinner.succeed();
            };

            _context11.prev = 4;

            if (!program.force) {
              _context11.next = 8;
              break;
            }

            _context11.next = 8;
            return executeCommand("rm -rf " + folder, "Removing " + folder);

          case 8:
            pkg = program.yarn ? "yarn" : "npm";

            if (program.yarn) {
              displaySuccessMessage("Using yarn to install");
            }
            _context11.next = 12;
            return executeCommand("mkdir " + folder, "Created " + folder);

          case 12:
            _context11.next = 14;
            return executeCommand(enterFolder(pkg + " init " + folder + " -y"), pkg + " init " + folder + " -y");

          case 14:
            dependencies = Object.entries(deps.dependencies).map(function (_ref2) {
              var _ref3 = (0, _slicedToArray3.default)(_ref2, 2),
                  dep = _ref3[0],
                  version = _ref3[1];

              return dep + "@" + version;
            }).join(" ");
            _context11.next = 17;
            return executeCommand(enterFolder(install() + " " + dependencies), "Installing dependencies");

          case 17:
            devDependencies = Object.entries(deps.devDependencies).map(function (_ref4) {
              var _ref5 = (0, _slicedToArray3.default)(_ref4, 2),
                  dep = _ref5[0],
                  version = _ref5[1];

              return dep + "@" + version;
            }).join(" ");
            _context11.next = 20;
            return executeCommand(enterFolder(install() + " -D " + devDependencies), "Installing devDependencies");

          case 20:
            _context11.next = 22;
            return scaffold();

          case 22:
            _context11.next = 24;
            return fixPackageJson();

          case 24:
            _context11.next = 29;
            break;

          case 26:
            _context11.prev = 26;
            _context11.t0 = _context11["catch"](4);

            if (!_context11.t0.message.indexOf("File exists")) {
              console.error("Something went wrong, sorry");
            } else if (_context11.t0.message.indexOf("File exists") !== -1) {
              console.error("You need to delete " + folder + ", or run again with -f");
            }

          case 29:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, undefined, [[4, 26]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}()).parse(process.argv);
