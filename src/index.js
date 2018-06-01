const program = require("commander");

program
  .arguments("<folder>")
  .action(folder => {
    console.log(folder);
  })
  .parse(process.argv);