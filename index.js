#!/usr/bin/env node
const program = require("commander");
const { exec } = require("child_process");

const executeCommand = (command, output) => {
  return new Promise((resolve, reject) => {
    try {
      exec(command, (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          if (output) {
            console.log(output);
          }
          resolve(stdout);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
program
  .arguments("<folder>")
  .action(async folder => {
    try {
      await executeCommand(`mkdir ${folder}`, `Created ${folder}`);
      await executeCommand(`cd ${folder}`, `cd'd into ${folder}`);


    } catch (error) {
      console.log("Something went wrong, sorry");
    }
  })
  .parse(process.argv);