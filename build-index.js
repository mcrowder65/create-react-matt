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
var fs = require("fs");

console.log("__dirname ", __dirname);
console.log("__filename ", __filename);
var deps = {
  "dependencies": ["babel-runtime", "babel-polyfill", "html-webpack-plugin", "prop-types", "react", "react-dom", "react-redux", "react-router", "react-router-dom", "redux", "redux-saga", "webpack", "node-sass", "history"],
  "devDependencies": ["babel-core", "babel-eslint", "babel-jest", "babel-loader", "babel-plugin-transform-async-to-generator", "babel-plugin-transform-class-properties", "babel-plugin-transform-es2015-modules-umd", "babel-plugin-transform-object-rest-spread", "babel-plugin-transform-runtime", "babel-preset-env", "babel-preset-react", "css-loader", "enzyme", "enzyme-adapter-react-16", "eslint-config-mcrowder65", "jest", "react-addons-test-utils", "react-test-renderer", "style-loader", "postcss-loader", "postcss-flexbugs-fixes", "sass-loader", "react-hot-loader", "webpack-dev-server", "identity-obj-proxy", "webpack-bundle-analyzer"]
};

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

program.arguments("<folder>").option("-y, --yarn", "Use yarn").option("-f, --force", "rm -rf's your folder for good measure").option("-s, --skip", "Doesn't save to node_modules").action(function () {
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
                return execInFolder("cat package.json");

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
                    setupTestFrameworkScriptFile: "<rootDir>/test/client/config.jsx",
                    moduleNameMapper: {
                      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/file-mock.js",
                      "\\.(css|scss|less)$": "identity-obj-proxy"
                    },
                    coverageReporters: ["html"]
                  })

                });
                _context.next = 10;
                return writeFile(folder + "/package.json", JSON.stringify(newPkg, null, 2));

              case 10:
                if (!program.skip) {
                  _context.next = 14;
                  break;
                }

                displaySuccessMessage("Skipping installation of node_modules");
                _context.next = 16;
                break;

              case 14:
                _context.next = 16;
                return execInFolder("" + install(), "Installing dependencies and devDependencies");

              case 16:
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
                files = ["webpack.config.js"];
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context2.prev = 4;
                _iterator = files[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context2.next = 21;
                  break;
                }

                f = _step.value;
                _context2.prev = 8;
                file = readFile("./" + f);
                _context2.next = 12;
                return writeFile(folder + "/" + f, file);

              case 12:
                _context2.next = 18;
                break;

              case 14:
                _context2.prev = 14;
                _context2.t0 = _context2["catch"](8);

                console.log(_context2.t0);
                throw _context2.t0;

              case 18:
                _iteratorNormalCompletion = true;
                _context2.next = 6;
                break;

              case 21:
                _context2.next = 27;
                break;

              case 23:
                _context2.prev = 23;
                _context2.t1 = _context2["catch"](4);
                _didIteratorError = true;
                _iteratorError = _context2.t1;

              case 27:
                _context2.prev = 27;
                _context2.prev = 28;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 30:
                _context2.prev = 30;

                if (!_didIteratorError) {
                  _context2.next = 33;
                  break;
                }

                throw _iteratorError;

              case 33:
                return _context2.finish(30);

              case 34:
                return _context2.finish(27);

              case 35:
                displaySuccessMessage("Files scaffolded and placed");

              case 36:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[4, 23, 27, 35], [8, 14], [28,, 30, 34]]);
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
              return new Promise(function (resolve, reject) {
                fs.readFile(filename, function (err, data) {
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
                return executeCommand(enterFolder(str), output);
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
            return executeCommand("rm -rf " + folder, "Removing " + folder);

          case 11:
            pkg = program.yarn ? "yarn" : "npm";

            if (program.yarn) {
              displaySuccessMessage("Using yarn to install");
            }
            _context3.next = 15;
            return executeCommand("mkdir " + folder, "Created " + folder);

          case 15:
            execInFolder = executeCmdInFolder();
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
