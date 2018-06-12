import { executeBashFunction, doesFileExist } from "./utils";

test("When passing -g, .gitignore should be created", async () => {
  const folder = "git";
  await executeBashFunction(`node index.js ${folder} -s -g`);
  const result = await doesFileExist(`${folder}/.gitignore`);
  expect(result).toBeTruthy();
});