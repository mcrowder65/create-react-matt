import { cli, doesFileExist } from "./utils";

test("When passing -g, but process.platform is win32, it should not run git init, so .gitignore should not be there", async () => {
  const folder = "win32-git";
  process.argv.push(folder);
  process.platform = "win32";
  await cli();
  const result = await doesFileExist(`${folder}/.gitignore`);
  expect(result).not.toBeTruthy();
});