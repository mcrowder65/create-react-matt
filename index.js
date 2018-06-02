#!/usr/bin/env node
const program = require("commander");
const { exec } = require("child_process");
const ora = require("ora");
const fs = require("fs");


const deps = {
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
    "webpack": "^3.8.1",
    "node-sass": "^4.9.0",
    "history": "^4.7.2"
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
    "webpack-dev-server": "^2.9.4",
    "identity-obj-proxy": "^3.0.0"
  }
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
  .option("-y, --yarn", "Add yarn")
  .option("-f, --force", "rm -rf's your folder for good measure")
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
      const dependencies = Object.entries(deps.dependencies).map(([dep, version]) => `${dep}@${version}`).join(" ");
      await execInFolder(`${install()} ${dependencies}`, "Installing dependencies");
      const devDependencies = Object.entries(deps.devDependencies).map(([dep, version]) => `${dep}@${version}`).join(" ");
      await execInFolder(`${install()} -D ${devDependencies}`, "Installing devDependencies");
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
      const newPkg = {
        ...pkgJson,
        eslintConfig: {
          "extends": ["mcrowder65"]
        },
        scripts: {
          ...pkgJson.scripts,
          start: "export NODE_ENV=development && webpack-dev-server",
          test: "npm run linter && npm run jest",
          jest: "jest --coverage",
          linter: "eslint src --ext .js,.jsx && eslint test --ext .js,.jsx"
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
      await writeFile(`${folder}/package.json`, JSON.stringify(newPkg));
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