import { cli, executeBuild, doesFileExist } from "./utils";

test("using npm", async () => {
  const folder = "npm";
  process.argv.push(folder);
  await cli();
  await executeBuild(folder);
  const doesPackageLockExist = await doesFileExist(`${folder}/package-lock.json`);
  expect(doesPackageLockExist).toBeTruthy();
});
