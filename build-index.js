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
program.arguments("<folder>").option("-y, --yarn", "Add yarn").action(function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(folder) {
    var pkg, spinner, dependencies, devDependencies, enterFolder, install;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            install = function install() {
              return program.yarn ? "yarn add" : "npm install";
            };

            enterFolder = function enterFolder(str) {
              return "cd " + folder + " && " + str;
            };

            _context.prev = 2;
            pkg = program.yarn ? "yarn" : "npm";

            if (program.yarn) {
              spinner = ora("Using yarn to install").start();

              spinner.succeed();
            }
            _context.next = 7;
            return executeCommand("mkdir " + folder, "Created " + folder);

          case 7:
            _context.next = 9;
            return executeCommand(enterFolder(pkg + " init " + folder + " -y"), pkg + " init " + folder + " -y");

          case 9:
            dependencies = Object.entries(deps.dependencies).map(function (_ref2) {
              var _ref3 = (0, _slicedToArray3.default)(_ref2, 2),
                  dep = _ref3[0],
                  version = _ref3[1];

              return dep + "@" + version;
            }).join(" ");
            _context.next = 12;
            return executeCommand(enterFolder(install() + " " + dependencies), "Installing dependencies");

          case 12:
            devDependencies = Object.entries(deps.devDependencies).map(function (_ref4) {
              var _ref5 = (0, _slicedToArray3.default)(_ref4, 2),
                  dep = _ref5[0],
                  version = _ref5[1];

              return dep + "@" + version;
            }).join(" ");
            _context.next = 15;
            return executeCommand(enterFolder(install() + " -D " + devDependencies), "Installing devDependencies");

          case 15:
            _context.next = 17;
            return executeCommand(enterFolder("echo '" + webpackConfig + "' > webpack.config.js"), "Webpack configured");

          case 17:
            _context.next = 22;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context["catch"](2);

            if (!_context.t0.message.indexOf("File exists")) {
              console.error("Something went wrong, sorry");
            }

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined, [[2, 19]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}()).parse(process.argv);
