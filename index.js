#!/usr/bin/env node
require("babel-polyfill");
const program = require("commander");
const { exec } = require("child_process");
const ora = require("ora");
const fs = require("fs-extra");

const packageJson = require("./package.json");

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
    "bundlesize",
    "compression-webpack-plugin",
    "css-loader",
    "enzyme",
    "enzyme-adapter-react-16",
    "eslint-config-mcrowder65",
    "jest",
    "fetch-mock",
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
const executeFunction = (func, loadingText) => {
  let spinner;
  return new Promise((resolve, reject) => {
    try {
      if (loadingText) {
        spinner = ora(loadingText).start();
      }
      func((error, output) => {
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

const removeFolder = folder => {
  return executeFunction(callback => fs.remove(folder, callback), `Removing ${folder}`);
};
const executeBashCommand = (command, loadingText) => {
  return executeFunction(callback => exec(command, callback), loadingText);
};

const createFolder = folder => {
  return executeFunction(callback => fs.mkdir(folder, callback), `Creating ${folder}`);
};


const cli = () => {
  return new Promise((outerResolve, outerReject) => {

    program
      .version(packageJson.version)
      .arguments("<folder>")
      .option("-y, --yarn", "Use yarn")
      .option("-t, --travis", "Create .travis.yml file")
      .option("-f, --force", "Removing your folder for good measure")
      .option("-s, --skip", "Doesn't save to node_modules")
      .option("-g, --git", "Does git init and creates .gitignore")
      .action(async folder => {
        let execInFolder;
        try {
          if (program.force) {
            await removeFolder(folder);
          }
          const pkg = program.yarn ? "yarn" : "npm";
          if (program.yarn) {
            displaySuccessMessage("Using yarn to install");
          }
          execInFolder = executeCmdInFolder();
          await createFolder(folder);
          await execInFolder(`${pkg} init ${folder} -y`, `${pkg} init ${folder} -y`);
          if (program.git) {
            await gitInit();
          }
          if (program.travis) {
            displaySuccessMessage("Created .travis.yml");
            await createTravisFile();
          }
          await scaffold();
          await fixPackageJson();
          outerResolve();
        } catch (error) {
          if (!error.message.indexOf("File exists")) {
            // eslint-disable-next-line no-console
            console.error("Something went wrong, sorry");
          } else if (error.message.indexOf("File exists") !== -1) {
            // eslint-disable-next-line no-console
            console.error(`You need to delete ${folder}, or run again with -f`);
          }
          outerReject();
        }
        async function fixPackageJson() {
          const pkgJson = JSON.parse(await readFile(`${folder}/package.json`, false));
          const { dependencies, devDependencies } = deps;

          const newPkg = {
            ...pkgJson,
            dependencies: mapDeps(dependencies),
            devDependencies: mapDeps(devDependencies),
            eslintConfig: {
              extends: ["mcrowder65"]
            },
            bundlesize: [
              {
                "path": "./build/bundle.js",
                "compression": "gzip",
                "maxSize": "100 kB"
              }
            ],
            scripts: {
              ...pkgJson.scripts,
              start: "export NODE_ENV=development && ./node_modules/.bin/webpack-dev-server",
              test: "npm run linter && npm run jest",
              jest: "./node_modules/.bin/jest --coverage",
              linter: "./node_modules/.bin/eslint src --ext .js,.jsx && ./node_modules/.bin/eslint test --ext .js,.jsx",
              webpack: "export NODE_ENV=production && ./node_modules/.bin/webpack -p --progress",
              bundlesize: "bundlesize",
              "analyze-bundle": "export ANALYZE_BUNDLE=true && npm run webpack"
            },
            jest: {
              ...pkgJson.jest,
              setupTestFrameworkScriptFile: "<rootDir>/test/client/config.js",
              moduleNameMapper: {
                "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/file-mock.js",
                "\\.(css|scss|less)$": "identity-obj-proxy"
              },
              collectCoverageFrom: [
                "src/client/**/*.{js*}",
                "!src/client/browser-history.js",
                "!src/client/app.js",
                "!src/client/router.js",
                "!src/client/actions/sagas/config.js",
                "!src/client/actions/sagas/index.js"
              ],
              modulePaths: ["src/client/"],
              coverageReporters: ["html"]
            }

          };
          await writeFile(`${folder}/package.json`, JSON.stringify(newPkg, null, 2));
          if (process.platform === "win32") {
            displaySuccessMessage("Installation of node_modules will be skipped because windows is not supported for node_module installation on this cli.");
          } else if (program.skip) {
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
        async function gitInit() {
          if (process.platform === "win32") {
            displaySuccessMessage("git initialization not supported on windows by this cli");
          } else {
            await execInFolder(`git init`, `git init`);
            const gitIgnore = `node_modules
coverage
build
.idea
npm-debug.log`;
            await writeFile(`${folder}/.gitignore`, gitIgnore);
            displaySuccessMessage(`.gitignore created`);
          }
        }
        async function scaffold() {
          const files = [
            "webpack.config.js",
            ".babelrc",
            "src/client/actions/sagas/config.js",
            "src/client/actions/sagas/index.js",
            "src/client/actions/sagas/ping-server.js",
            "src/client/actions/sagas/types.js",
            "src/client/actions/index.js",
            "src/client/actions/types.js",
            "src/client/components/home.js",
            "src/client/reducers/index.js",
            "src/client/reducers/initial-state.js",
            "src/client/styles/base.scss",
            "src/client/app.js",
            "src/client/browser-history.js",
            "src/client/index.html",
            "src/client/router.js",
            "test/client/__mocks__/file-mock.js",
            "test/client/actions/sagas/ping-server.spec.js",
            "test/client/actions/index.spec.js",
            "test/client/config.js",
            "test/client/reducers/index.spec.js"
          ];
          for (const f of files) {
            try {
              const file = await readFile(`./${f}`);
              await writeFile(`${folder}/${f}`, file);
            } catch (e) {
              // eslint-disable-next-line no-console
              console.log(e);
              throw e;
            }
          }
          displaySuccessMessage("Files scaffolded and placed");

        }

        async function createTravisFile() {
          const travisFile = `
language: node_js
node_js: 8.9.4
script:
- npm test;
- npm run webpack;
- npm run bundlesize;`;
          await writeFile(`${folder}/.travis.yml`, travisFile);
        }
        function displaySuccessMessage(message) {
          const spinner = ora(message).start();
          spinner.succeed();
        }

        function executeCmdInFolder() {
          return (str, output) => executeBashCommand(enterFolder(str), output);
        }
        function enterFolder(str, post) {
          return `cd ${folder}${post ? post : ""} && ${str}`;
        }
        function install() {
          return program.yarn ? "yarn add" : "npm install";
        }
        function readFile(filename, includeDirname = true) {
          return new Promise((resolve, reject) => {
            fs.readFile(`${includeDirname ? `${__dirname}/` : ""}${filename}`, "UTF-8", (err, data) => {
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
                  // eslint-disable-next-line no-console
                  console.log(error);
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              // eslint-disable-next-line no-console
              console.log(error);
              reject(error);
            }
          });
        }
      })
      .parse(process.argv);
  });

};

export default cli;