import { cli, doesFileExist } from "./utils";

test("When passing -g, .gitignore should be created", async () => {
  const folder = "git";
  process.argv.push(folder);
  process.argv.push("-s");
  process.argv.push("-g");
  await cli();
  const result = await doesFileExist(`${folder}/.gitignore`);
  expect(result).toBeTruthy();
});