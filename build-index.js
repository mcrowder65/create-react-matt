#!/usr/bin/env node
"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require("babel-runtime/helpers/extends");

var _extends4 = _interopRequireDefault(_extends3);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("babel-polyfill");
var program = require("commander");

var _require = require("child_process"),
    exec = _require.exec;

var ora = require("ora");
var fs = require("fs-extra");

var deps = {
  "dependencies": ["babel-runtime", "babel-polyfill", "html-webpack-plugin", "prop-types", "react", "react-dom", "react-redux", "react-router", "react-router-dom", "redux", "redux-saga", "webpack", "node-sass", "history"],
  "devDependencies": ["babel-core", "babel-eslint", "babel-jest", "babel-loader", "babel-plugin-transform-async-to-generator", "babel-plugin-transform-class-properties", "babel-plugin-transform-es2015-modules-umd", "babel-plugin-transform-object-rest-spread", "babel-plugin-transform-runtime", "babel-preset-env", "babel-preset-react", "compression-webpack-plugin", "css-loader", "enzyme", "enzyme-adapter-react-16", "eslint-config-mcrowder65", "jest", "fetch-mock", "style-loader", "postcss-loader", "postcss-flexbugs-fixes", "sass-loader", "react-hot-loader", "webpack-dev-server", "identity-obj-proxy", "webpack-bundle-analyzer"]
};
var executeFunction = function executeFunction(func, loadingText) {
  var spinner = void 0;
  return new Promise(function (resolve, reject) {
    try {
      if (loadingText) {
        spinner = ora(loadingText).start();
      }
      func(function (error, output) {
        if (error) {
          spinner.fail(error.message);
          reject(error);
        } else {
          if (loadingText) {
            spinner.succeed();
          }
          resolve(output);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

var removeFolder = function removeFolder(folder) {
  return executeFunction(function (callback) {
    return fs.remove(folder, callback);
  }, "Removing " + folder);
};
var executeBashCommand = function executeBashCommand(command, loadingText) {
  return executeFunction(function (callback) {
    return exec(command, callback);
  }, loadingText);
};

var createFolder = function createFolder(folder) {
  return executeFunction(function (callback) {
    return fs.mkdir(folder, callback);
  }, "Creating " + folder);
};
program.arguments("<folder>").option("-y, --yarn", "Use yarn").option("-f, --force", "Removing your folder for good measure").option("-s, --skip", "Doesn't save to node_modules").action(function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(folder) {
    var fixPackageJson = function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var pkgJson, dependencies, devDependencies, newPkg, mapDeps;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                mapDeps = function mapDeps(myDeps) {
                  var mattPkg = require("./package.json");
                  var combined = (0, _extends4.default)({}, mattPkg.devDependencies, mattPkg.dependencies);
                  return myDeps.reduce(function (accum, d) {
                    return (0, _extends4.default)({}, accum, (0, _defineProperty3.default)({}, d, combined[d]));
                  }, {});
                };

                _context.t0 = JSON;
                _context.next = 4;
                return readFile(folder + "/package.json", false);

              case 4:
                _context.t1 = _context.sent;
                pkgJson = _context.t0.parse.call(_context.t0, _context.t1);
                dependencies = deps.dependencies, devDependencies = deps.devDependencies;
                newPkg = (0, _extends4.default)({}, pkgJson, {
                  dependencies: mapDeps(dependencies),
                  devDependencies: mapDeps(devDependencies),
                  eslintConfig: {
                    extends: ["mcrowder65"]
                  },
                  scripts: (0, _extends4.default)({}, pkgJson.scripts, {
                    start: "export NODE_ENV=development && ./node_modules/.bin/webpack-dev-server",
                    test: "npm run linter && npm run jest",
                    jest: "./node_modules/.bin/jest --coverage",
                    linter: "./node_modules/.bin/eslint src --ext .js,.jsx && ./node_modules/.bin/eslint test --ext .js,.jsx",
                    webpack: "export NODE_ENV=production && ./node_modules/.bin/webpack -p --progress",
                    "analyze-bundle": "export ANALYZE_BUNDLE=true && npm run webpack"
                  }),
                  jest: (0, _extends4.default)({}, pkgJson.jest, {
                    setupTestFrameworkScriptFile: "<rootDir>/test/client/config.js",
                    moduleNameMapper: {
                      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/file-mock.js",
                      "\\.(css|scss|less)$": "identity-obj-proxy"
                    },
                    collectCoverageFrom: ["src/client/**/*.{js*}", "!src/client/browser-history.js", "!src/client/app.js", "!src/client/router.js", "!src/client/actions/sagas/config.js", "!src/client/actions/sagas/index.js"],
                    modulePaths: ["src/client/"],
                    coverageReporters: ["html"]
                  })

                });
                _context.next = 10;
                return writeFile(folder + "/package.json", JSON.stringify(newPkg, null, 2));

              case 10:
                if (!(process.platform === "win32")) {
                  _context.next = 14;
                  break;
                }

                displaySuccessMessage("Installation of node_modules will be skipped because windows is not supported for node_module installation on this cli.");
                _context.next = 20;
                break;

              case 14:
                if (!program.skip) {
                  _context.next = 18;
                  break;
                }

                displaySuccessMessage("Skipping installation of node_modules");
                _context.next = 20;
                break;

              case 18:
                _context.next = 20;
                return execInFolder("" + install(), "Installing dependencies and devDependencies");

              case 20:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function fixPackageJson() {
        return _ref2.apply(this, arguments);
      };
    }();

    var scaffold = function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var files, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, f, file;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                files = ["webpack.config.js", ".babelrc", "src/client/actions/sagas/config.js", "src/client/actions/sagas/index.js", "src/client/actions/sagas/ping-server.js", "src/client/actions/sagas/types.js", "src/client/actions/index.js", "src/client/actions/types.js", "src/client/components/home.js", "src/client/reducers/index.js", "src/client/reducers/initial-state.js", "src/client/styles/base.scss", "src/client/app.js", "src/client/browser-history.js", "src/client/index.html", "src/client/router.js", "test/client/__mocks__/file-mock.js", "test/client/actions/sagas/ping-server.spec.js", "test/client/actions/index.spec.js", "test/client/config.js", "test/client/reducers/index.spec.js"];
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context2.prev = 4;
                _iterator = files[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context2.next = 23;
                  break;
                }

                f = _step.value;
                _context2.prev = 8;
                _context2.next = 11;
                return readFile("./" + f);

              case 11:
                file = _context2.sent;
                _context2.next = 14;
                return writeFile(folder + "/" + f, file);

              case 14:
                _context2.next = 20;
                break;

              case 16:
                _context2.prev = 16;
                _context2.t0 = _context2["catch"](8);

                console.log(_context2.t0);
                throw _context2.t0;

              case 20:
                _iteratorNormalCompletion = true;
                _context2.next = 6;
                break;

              case 23:
                _context2.next = 29;
                break;

              case 25:
                _context2.prev = 25;
                _context2.t1 = _context2["catch"](4);
                _didIteratorError = true;
                _iteratorError = _context2.t1;

              case 29:
                _context2.prev = 29;
                _context2.prev = 30;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 32:
                _context2.prev = 32;

                if (!_didIteratorError) {
                  _context2.next = 35;
                  break;
                }

                throw _iteratorError;

              case 35:
                return _context2.finish(32);

              case 36:
                return _context2.finish(29);

              case 37:
                displaySuccessMessage("Files scaffolded and placed");

              case 38:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[4, 25, 29, 37], [8, 16], [30,, 32, 36]]);
      }));

      return function scaffold() {
        return _ref3.apply(this, arguments);
      };
    }();

    var execInFolder, pkg, displaySuccessMessage, executeCmdInFolder, enterFolder, install, readFile, writeFile;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            writeFile = function writeFile(filename, content) {
              return new Promise(function (resolve, reject) {
                try {
                  var dirs = filename.split("/");
                  if (dirs) {
                    dirs.forEach(function (d, i) {
                      var dir = makeDir(d, i);
                      if (!fs.existsSync(dir) && d.indexOf(".") === -1) {
                        fs.mkdirSync(dir);
                      }
                      function makeDir(currentDirectory, index) {
                        return dirs.filter(function (di, ind) {
                          return ind <= index;
                        }).join("/");
                      }
                    });
                  }
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

            readFile = function readFile(filename) {
              var includeDirname = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

              return new Promise(function (resolve, reject) {
                fs.readFile("" + (includeDirname ? __dirname + "/" : "") + filename, "UTF-8", function (err, data) {
                  try {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(data);
                    }
                  } catch (error) {
                    reject(error);
                  }
                });
              });
            };

            install = function install() {
              return program.yarn ? "yarn add" : "npm install";
            };

            enterFolder = function enterFolder(str, post) {
              return "cd " + folder + (post ? post : "") + " && " + str;
            };

            executeCmdInFolder = function executeCmdInFolder() {
              return function (str, output) {
                return executeBashCommand(enterFolder(str), output);
              };
            };

            displaySuccessMessage = function displaySuccessMessage(message) {
              var spinner = ora(message).start();
              spinner.succeed();
            };

            execInFolder = void 0;
            _context3.prev = 7;

            if (!program.force) {
              _context3.next = 11;
              break;
            }

            _context3.next = 11;
            return removeFolder(folder);

          case 11:
            pkg = program.yarn ? "yarn" : "npm";

            if (program.yarn) {
              displaySuccessMessage("Using yarn to install");
            }
            execInFolder = executeCmdInFolder();
            _context3.next = 16;
            return createFolder(folder);

          case 16:
            _context3.next = 18;
            return execInFolder(pkg + " init " + folder + " -y", pkg + " init " + folder + " -y");

          case 18:
            _context3.next = 20;
            return scaffold();

          case 20:
            _context3.next = 22;
            return fixPackageJson();

          case 22:
            _context3.next = 27;
            break;

          case 24:
            _context3.prev = 24;
            _context3.t0 = _context3["catch"](7);

            if (!_context3.t0.message.indexOf("File exists")) {
              console.error("Something went wrong, sorry");
            } else if (_context3.t0.message.indexOf("File exists") !== -1) {
              console.error("You need to delete " + folder + ", or run again with -f");
            }

          case 27:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[7, 24]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}()).parse(process.argv);
