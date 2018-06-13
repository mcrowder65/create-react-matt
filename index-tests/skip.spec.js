import { doesFileExist, cli } from "./utils";

test("When passing -s, node_modules shouldn't be installed", async () => {
  const folder = "skip";
  process.argv.push(folder);
  process.argv.push("-s");
  await cli();
  expect(await doesFileExist(folder)).toBeTruthy();
  const result = await doesFileExist(`${folder}/node_modules`);
  expect(result).not.toBeTruthy();
});
