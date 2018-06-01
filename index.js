#!/usr/bin/env node
const program = require("commander");
const { exec } = require("child_process");

const deps = {
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
  }};
const executeCommand = (command, output) => {
  return new Promise((resolve, reject) => {
    try {
      exec(command, (error, stdout) => {
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

program
  .arguments("<folder>")
  .action(async folder => {
    try {
      await executeCommand(`mkdir ${folder}`, `Created ${folder}`);
      await executeCommand(`cd ${folder}`, `cd'd into ${folder}`);
      await executeCommand(`npm init ${folder} -y`, `npm init done`);
      const dependencies = Object.entries(deps.dependencies).map(([dep, version]) => `${dep}@${version}`).join(" ");
      await executeCommand(`npm install --save ${dependencies}`, "dependencies installed");
      const devDependencies = Object.entries(deps.devDependencies).map(([dep, version]) => `${dep}@${version}`).join(" ");
      await executeCommand(`npm install --save-dev ${devDependencies}`, "devDependencies installed");
    } catch (error) {
      console.log("Something went wrong, sorry");
    }
  })
  .parse(process.argv);