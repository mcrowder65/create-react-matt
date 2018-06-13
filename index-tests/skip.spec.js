import { executeBashFunction, doesFileExist } from "./utils";

test("When passing -s, node_modules shouldn't be installed", async () => {
  const folder = "skip";
  await executeBashFunction(`node index.js ${folder} -s`);
  const result = await doesFileExist(`${folder}/node_modules`);
  expect(result).not.toBeTruthy();
});
