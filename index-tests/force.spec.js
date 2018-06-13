import { executeBashFunction, cli, doesFileExist } from "./utils.js";

test("When force exists, it should reject", async () => {
  try {
    const folder = "force";
    await executeBashFunction(`mkdir ${folder}`);
    process.argv.push(folder);
    await cli();

  } catch (e) {
    expect(e.message.indexOf("file already exists")).toBeGreaterThan(-1);
  }
});

test("When force exists and you pass -f, it should delete it and work!", async () => {
  const folder = "forcef";
  await executeBashFunction(`mkdir ${folder}`);
  process.argv.push(folder);
  process.argv.push("-f");
  process.argv.push("-s");
  await cli();
  expect(await doesFileExist(folder)).toBeTruthy();
});