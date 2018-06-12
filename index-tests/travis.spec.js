import { executeBashFunction, doesFileExist } from "./utils";

test("When passing -t, .travis.yml should be created", async () => {
  const folder = "travis";
  await executeBashFunction(`node index.js ${folder} -s -t`);
  const result = await doesFileExist(`${folder}/.travis.yml`);
  expect(result).toBeTruthy();
});