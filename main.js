const func = require("./build-index.js").default;

const exec = async () => {
  try {
    await func();
    // eslint-disable-next-line no-console
    console.log("Finished without errors");
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("Finished with errors");
  }
};
exec();