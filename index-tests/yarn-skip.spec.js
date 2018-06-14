import { doesFileExist, cli } from "./utils";

test.skip("when passing -y, and -s yarn should be used to init, but no node_modules should be there", async () => {
  const folder = "yarn-skip";
  process.argv.push(folder);
  process.argv.push("-y");
  process.argv.push("-s");
  await cli();
  const areNodeModulesThere = await doesFileExist(`${folder}/node_modules`);
  expect(areNodeModulesThere).not.toBeTruthy();
});