import { executeBashFunction, executeBuild, doesFileExist } from "./utils";

test.skip("when passing -y, yarn should be used.", async () => {
  const folder = "yarn";
  await executeBashFunction(`node index.js ${folder} -y`);
  await executeBuild(folder);
  const doesYarnLockExist = await doesFileExist(`${folder}/yarn.lock`);
  expect(doesYarnLockExist).toBeTruthy();
});

test.skip("When skipping installation, node_modules should not be there", async () => {
  const folder = "yarn-skip";
  await executeBashFunction(`node index.js ${folder} -y -s`);
  const doesNodeModulesExist = await doesFileExist(`${folder}/node_modules`);
  expect(doesNodeModulesExist).toBeTruthy();
});


