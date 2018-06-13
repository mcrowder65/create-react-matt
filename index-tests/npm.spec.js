import { executeBashFunction, executeBuild, doesFileExist } from "./utils";

test("using npm", async () => {
  const folder = "npm";
  await executeBashFunction(`node index.js ${folder}`);
  await executeBuild(folder);
  const doesPackageLockExist = await doesFileExist(`${folder}/package-lock.json`);
  expect(doesPackageLockExist).toBeTruthy();
});


