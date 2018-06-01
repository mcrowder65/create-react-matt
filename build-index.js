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

var ora = require("ora");

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

var executeCommand = function executeCommand(command, loadingText) {
  if (!loadingText) {
    // eslint-disable-next-line no-param-reassign
    loadingText = command;
  }
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

var webpackConfig = "const HtmlWebpackPlugin = require(\"html-webpack-plugin\");\nconst HtmlWebpackPluginConfig = new HtmlWebpackPlugin({\n  template: \"./src/client/index.html\",\n  filename: \"./index.html\",\n  inject: \"body\"\n});\nmodule.exports = {\n  cache: true,\n  devtool: \"sourcemap\",\n  entry: \"./src/client/app.jsx\",\n  output: {\n    path: `" + __dirname + "/build`,\n    filename: \"bundle.js\"\n  },\n  resolve: {\n    extensions: [\".js\", \".jsx\"]\n  },\n  module: {\n    loaders: [\n      {\n        test: /.js$/,\n        loader: \"babel-loader\",\n        exclude: /node_modules/\n      }, {\n        test: /.jsx$/,\n        loader: \"babel-loader\",\n        exclude: /node_modules/\n      }, {\n        test: /.css$/,\n        loader: \"style-loader!css-loader\"\n      }\n    ]\n  },\n  devServer: {\n    historyApiFallback: true\n  },\n  plugins: [HtmlWebpackPluginConfig]\n\n};";

program.arguments("<folder>").option("-y, --yarn", "Add yarn").option("-f, --force", "rm -rf's your folder for good measure").action(function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(folder) {
    var createFolderStructure = function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return executeCommand(enterFolder("mkdir -p src/client/actions/sagas && mkdir -p src/client/components && mkdir -p src/client/reducers && mkdir -p src/client/styles"));

              case 2:
                _context.next = 4;
                return executeCommand(enterFolder("mkdir -p test/client/actions/sagas && mkdir -p test/client/components"));

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function createFolderStructure() {
        return _ref6.apply(this, arguments);
      };
    }();

    var pkg, spinner, dependencies, devDependencies, enterFolder, install;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            install = function install() {
              return program.yarn ? "yarn add" : "npm install";
            };

            enterFolder = function enterFolder(str) {
              return "cd " + folder + " && " + str;
            };

            _context2.prev = 2;

            if (!program.force) {
              _context2.next = 6;
              break;
            }

            _context2.next = 6;
            return executeCommand("rm -rf " + folder);

          case 6:
            pkg = program.yarn ? "yarn" : "npm";

            if (program.yarn) {
              spinner = ora("Using yarn to install").start();

              spinner.succeed();
            }
            _context2.next = 10;
            return executeCommand("mkdir " + folder, "Created " + folder);

          case 10:
            _context2.next = 12;
            return executeCommand(enterFolder(pkg + " init " + folder + " -y"), pkg + " init " + folder + " -y");

          case 12:
            dependencies = Object.entries(deps.dependencies).map(function (_ref2) {
              var _ref3 = (0, _slicedToArray3.default)(_ref2, 2),
                  dep = _ref3[0],
                  version = _ref3[1];

              return dep + "@" + version;
            }).join(" ");
            _context2.next = 15;
            return executeCommand(enterFolder(install() + " " + dependencies), "Installing dependencies");

          case 15:
            devDependencies = Object.entries(deps.devDependencies).map(function (_ref4) {
              var _ref5 = (0, _slicedToArray3.default)(_ref4, 2),
                  dep = _ref5[0],
                  version = _ref5[1];

              return dep + "@" + version;
            }).join(" ");
            _context2.next = 18;
            return executeCommand(enterFolder(install() + " -D " + devDependencies), "Installing devDependencies");

          case 18:
            _context2.next = 20;
            return executeCommand(enterFolder("echo '" + webpackConfig + "' > webpack.config.js"), "Webpack configured");

          case 20:
            _context2.next = 22;
            return createFolderStructure();

          case 22:
            _context2.next = 27;
            break;

          case 24:
            _context2.prev = 24;
            _context2.t0 = _context2["catch"](2);

            if (!_context2.t0.message.indexOf("File exists")) {
              console.error("Something went wrong, sorry");
            } else if (_context2.t0.message.indexOf("File exists") !== -1) {
              console.error("You need to delete " + folder + ", or run again with -f");
            }

          case 27:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[2, 24]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}()).parse(process.argv);
