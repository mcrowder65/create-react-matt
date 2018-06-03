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
    "identity-obj-proxy"
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

const curlCmd = `curl -O https://raw.githubusercontent.com/mcrowder65/create-react-matt/master/`;

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
      const {dependencies, devDependencies} = deps;

      const newPkg = {
        ...pkgJson,
        dependencies: mapDeps(dependencies),
        devDependencies: mapDeps(devDependencies),
        eslintConfig: {
          "extends": ["mcrowder65"]
        },
        scripts: {
          ...pkgJson.scripts,
          start: "export NODE_ENV=development && node_modules/.bin/webpack-dev-server",
          test: "npm run linter && npm run jest",
          jest: "node_modules/.bin/jest --coverage",
          linter: "node_modules/.bin/eslint src --ext .js,.jsx && node_modules/.bin/eslint test --ext .js,.jsx",
          webpack: "export NODE_ENV=production && node_modules/.bin/webpack"
        },
        jest: {
          ...pkgJson.jest,
          "setupTestFrameworkScriptFile": "<rootDir>/test/client/config.jsx",
          "moduleNameMapper": {
            "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/file-mock.js",
            "\\.(css|scss|less)$": "identity-obj-proxy"
          },
          "coverageReporters": ["html"]
        }

      };
      await writeFile(`${folder}/package.json`, JSON.stringify(newPkg, null, 2));
      if (program.skip) {
        displaySuccessMessage("Skipping installation of node_modules");
      } else {
        await execInFolder(`${install()} ${dependencies}`, "Installing dependencies");
        await execInFolder(`${install()} -D ${devDependencies}`, "Installing devDependencies");
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
      await createFolderStructure();
      await createConfigs();
      await createSagas();
      await createActions();
      await createComponents();
      await createReducers();
      await createStyles();
      await createClientFiles();

      displaySuccessMessage("Files scaffolded and placed");

      async function createConfigs() {
        const configFetcher = fileGetter("");
        await configFetcher(".babelrc");
        await configFetcher("webpack.config.js");
      }
      async function createSagas() {
        const sagaFetcher = fileGetter(`src/client/actions/sagas`);
        await sagaFetcher(`config.jsx`);
        await sagaFetcher(`index.jsx`);
        await sagaFetcher(`ping-server.jsx`);
        await sagaFetcher(`types.jsx`);

        const sagaTestFetcher = fileGetter("test/client/actions/sagas");
        await sagaTestFetcher("ping-server.spec.jsx");
      }
      async function createActions() {
        const actionFetcher = fileGetter(`src/client/actions`);
        await actionFetcher("index.jsx");
        await actionFetcher("types.jsx");

        const actionTestFetcher = fileGetter("test/client/actions");
        await actionTestFetcher("index.spec.jsx");
      }
      async function createComponents() {
        const componentFetcher = fileGetter("src/client/components");
        await componentFetcher("home.jsx");

        const componentTestFetcher = fileGetter("test/client/components");
        await componentTestFetcher("home.spec.jsx");
      }
      async function createReducers() {
        const reducerFetcher = fileGetter("src/client/reducers");
        await reducerFetcher("index.jsx");
        await reducerFetcher("initial-state.jsx");
      }
      async function createStyles() {
        const stylesFetcher = fileGetter("src/client/styles");
        await stylesFetcher("base.scss");
      }
      async function createClientFiles() {
        const clientFileFetcher = fileGetter("src/client");
        await clientFileFetcher("app.jsx");
        await clientFileFetcher("index.html");
        await clientFileFetcher("router.jsx");
        await clientFileFetcher("browser-history.jsx");

        const clientTestFileFetcher = fileGetter("test/client");
        await clientTestFileFetcher("config.jsx");

        const clientMockTestFetcher = fileGetter("test/client/__mocks__");
        await clientMockTestFetcher("file-mock.js");
      }
      function fileGetter(filepath) {
        return function (filename) {
          executeCommand(enterFolder(`${curlCmd}${filepath}/${filename}`, `/${filepath}`));
        };
      }
      async function createFolderStructure() {
        await execInFolder(`mkdir -p src/client/actions/sagas && mkdir -p src/client/components && mkdir -p src/client/reducers && mkdir -p src/client/styles`);
        await execInFolder(`mkdir -p test/client/actions/sagas && mkdir -p test/client/components && mkdir -p test/client/__mocks__`);
      }
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