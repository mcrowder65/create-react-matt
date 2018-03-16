//Require dependencies
const yeoman = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

/*eslint-disable object-shorthand */

module.exports = yeoman.generators.Base.extend({
//Configurations will be loaded here.
  //Ask for user input
  prompting: function () {
    const done = this.async();
    this.prompt({
      type: "input",
      name: "name",
      message: "Your project name",
      //Defaults to the project's folder name if the input is skipped
      default: this.appname
    }, function (answers) {
      this.props = answers;
      this.log(answers.name);
      done();
    }.bind(this));
  },
  writing: function () {
    this.fs.copyTpl(
      this.templatePath("_package.json"),
      this.destinationPath("package.json"), {
        name: this.props.name
      }
    );
  },
  install: function () {
    this.installDependencies();
  }


});
