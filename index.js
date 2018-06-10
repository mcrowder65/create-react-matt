#!/usr/bin/env node
require("babel-polyfill");
const program = require("commander");
const { exec } = require("child_process");
const ora = require("ora");
const fs = require("fs");

const deps = {
  "dependencies": [
    "babel-runtime",
    "babel-polyfill",
    "html-webpack-plugin",
    "prop-types",
    "react",
    "react-dom",
    "react-redux",
    "react-router",
    "react-router-dom",
    "redux",
    "redux-saga",
    "webpack",
    "node-sass",
    "history"
  ],
  "devDependencies": [
    "babel-core",
    "babel-eslint",
    "babel-jest",
    "babel-loader",
    "babel-plugin-transform-async-to-generator",
    "babel-plugin-transform-class-properties",
    "babel-plugin-transform-es2015-modules-umd",
    "babel-plugin-transform-object-rest-spread",
    "babel-plugin-transform-runtime",
    "babel-preset-env",
    "babel-preset-react",
    "css-loader",
    "enzyme",
    "enzyme-adapter-react-16",
    "eslint-config-mcrowder65",
    "jest",
    "react-addons-test-utils",
    "react-test-renderer",
    "style-loader",
    "postcss-loader",
    "postcss-flexbugs-fixes",
    "sass-loader",
    "react-hot-loader",
    "webpack-dev-server",
    "identity-obj-proxy",
    "webpack-bundle-analyzer"
  ]
};

const executeCommand = (command, loadingText) => {
  let spinner;
  return new Promise((resolve, reject) => {
    try {
      if (loadingText) {
        spinner = ora(loadingText).start();
      }
      exec(command, (error, stdout) => {
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

program
  .arguments("<folder>")
  .option("-y, --yarn", "Use yarn")
  .option("-f, --force", "rm -rf's your folder for good measure")
  .option("-s, --skip", "Doesn't save to node_modules")
  .action(async folder => {
    let execInFolder;
    try {
      if (program.force) {
        await executeCommand(`rm -rf ${folder}`, `Removing ${folder}`);
      }
      const pkg = program.yarn ? "yarn" : "npm";
      if (program.yarn) {
        displaySuccessMessage("Using yarn to install");
      }
      await executeCommand(`mkdir ${folder}`, `Created ${folder}`);
      execInFolder = executeCmdInFolder();
      await execInFolder(`${pkg} init ${folder} -y`, `${pkg} init ${folder} -y`);
      await scaffold();
      await fixPackageJson();
    } catch (error) {
      if (!error.message.indexOf("File exists")) {
        console.error("Something went wrong, sorry");
      } else if (error.message.indexOf("File exists") !== -1) {
        console.error(`You need to delete ${folder}, or run again with -f`);
      }
    }
    async function fixPackageJson() {

      const pkgJson = JSON.parse(await execInFolder("cat package.json"));
      const { dependencies, devDependencies } = deps;

      const newPkg = {
        ...pkgJson,
        dependencies: mapDeps(dependencies),
        devDependencies: mapDeps(devDependencies),
        eslintConfig: {
          extends: ["mcrowder65"]
        },
        scripts: {
          ...pkgJson.scripts,
          start: "export NODE_ENV=development && ./node_modules/.bin/webpack-dev-server",
          test: "npm run linter && npm run jest",
          jest: "./node_modules/.bin/jest --coverage",
          linter: "./node_modules/.bin/eslint src --ext .js,.jsx && ./node_modules/.bin/eslint test --ext .js,.jsx",
          webpack: "export NODE_ENV=production && ./node_modules/.bin/webpack -p --progress",
          "analyze-bundle": "export ANALYZE_BUNDLE=true && npm run webpack"
        },
        jest: {
          ...pkgJson.jest,
          setupTestFrameworkScriptFile: "<rootDir>/test/client/config.jsx",
          moduleNameMapper: {
            "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/file-mock.js",
            "\\.(css|scss|less)$": "identity-obj-proxy"
          },
          coverageReporters: ["html"]
        }

      };
      await writeFile(`${folder}/package.json`, JSON.stringify(newPkg, null, 2));
      if (program.skip) {
        displaySuccessMessage("Skipping installation of node_modules");
      } else {
        await execInFolder(`${install()}`, "Installing dependencies and devDependencies");
      }
      function mapDeps(myDeps) {
        const mattPkg = require("./package.json");
        const combined = {
          ...mattPkg.devDependencies,
          ...mattPkg.dependencies
        };
        return myDeps.reduce((accum, d) => {
          return {
            ...accum,
            [d]: combined[d]
          };
        }, {});
      }
    }
    async function scaffold() {
      const files = [
        "webpack.config.js",
        ".babelrc",
        "src/client/actions/sagas/config.jsx",
        "src/client/actions/sagas/index.jsx",
        "src/client/actions/sagas/ping-server.jsx",
        "src/client/actions/sagas/types.jsx",
        "src/client/actions/index.jsx",
        "src/client/actions/types.jsx",
        "src/client/components/home.jsx",
        "src/client/reducers/index.jsx",
        "src/client/reducers/initial-state.jsx",
        "src/client/styles/base.scss",
        "src/client/app.jsx",
        "src/client/browser-history.jsx",
        "src/client/index.html",
        "src/client/router.jsx",
        "test/client/__mocks__/file-mock.js",
        "test/client/actions/sagas/ping-server.spec.jsx",
        "test/client/actions/index.spec.jsx",
        "test/client/components/home.spec.jsx",
        "test/client/config.jsx"
      ];
      for (const f of files) {

        try {
          const file = await executeCommand(`cat ${f}`);
          await writeFile(`${folder}/${f}`, file);
        } catch (e) {
          console.log(e);
        }
      }
      displaySuccessMessage("Files scaffolded and placed");
    }

    function displaySuccessMessage(message) {
      const spinner = ora(message).start();
      spinner.succeed();
    }

    function executeCmdInFolder() {
      return (str, output) => executeCommand(enterFolder(str), output);
    }
    function enterFolder(str, post) {
      return `cd ${folder}${post ? post : ""} && ${str}`;
    }
    function install() {
      return program.yarn ? "yarn add" : "npm install";
    }

    function writeFile(filename, content) {
      return new Promise((resolve, reject) => {
        try {
          const dirs = filename.split("/");
          if (dirs) {
            dirs.forEach((d, i) => {
              const dir = makeDir(d, i);
              if (!fs.existsSync(dir) && d.indexOf(".") === -1) {
                fs.mkdirSync(dir);
              }
              function makeDir(currentDirectory, index) {
                return dirs.filter((di, ind) => ind <= index).join("/");
              }
            });
          }
          fs.writeFile(filename, content, error => {
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
    }
  })
  .parse(process.argv);