
import { exec } from "child_process";
import fs from "fs-extra";

import reactCli from "../index";


const executeFunction = func => {
  return new Promise((resolve, reject) => {
    try {
      func((error, output) => {
        if (error) {
          reject(error);
        } else {
          resolve(output);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
export const executeBashFunction = command => {
  return executeFunction(callback => exec(command, callback));
};
export const executeBuild = folder => {
  return executeBashFunction(`cd ${folder} && npm test && npm run webpack && npm run bundlesize`);
};

export const doesFileExist = async path => {
  try {
    return await executeFunction(callback => fs.stat(path, callback));
  } catch (error) {
    return false;
  }
};

export const cli = () => reactCli();