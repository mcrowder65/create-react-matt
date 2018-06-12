const { exec } = require("child_process");

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
const e = (command, loadingText) => {
  return executeFunction(callback => exec(command, callback), loadingText);
};
const executeBuild = folder => {
  return e(`cd ${folder} && npm test && npm run webpack && npm run bundlesize`);
};
jest.setTimeout(90000);
test("standard", async () => {
  const folder = "standard";
  try {
    await e(`rm -rf ${folder}`);
    await e(`node index.js ${folder}`);
    await executeBuild(folder);
  } finally {
    await e(`rm -rf ${folder}`);
  }
});
