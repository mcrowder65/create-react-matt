import { cli, doesFileExist } from "./utils";

test("When passing -t, .travis.yml should be created", async () => {
  const folder = "travis";
  process.argv.push(folder);
  process.argv.push("-s");
  process.argv.push("-t");
  await cli();
  const result = await doesFileExist(`${folder}/.travis.yml`);
  expect(result).toBeTruthy();
});