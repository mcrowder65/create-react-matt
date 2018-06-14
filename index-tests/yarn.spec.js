import { doesFileExist, cli } from "./utils";

test("when passing -y, yarn should be used.", async () => {
  const folder = "yarn";
  process.argv.push(folder);
  process.argv.push("-y");
  await cli();
  const doesYarnLockExist = await doesFileExist(`${folder}/yarn.lock`);
  expect(doesYarnLockExist).toBeTruthy();
});