"use strict";
import { setup } from "./lib/initalise";

const inquirer = require("inquirer");

export default () => {
  const questions = [
    {
      type: "input",
      name: "destDir",
      message:
        "Where do you want templates to be installed (use absolute path)?"
    },
    {
      type: "input",
      name: "target",
      // TODO don't make user type the path, but give him the list of templates available
      message: "What's the name of the template you want to install?"
    }
  ];

  inquirer.prompt(questions).then(answers => {
    const { target, destDir } = answers;
    console.log(`You decide to install ${target} to ${destDir}`);
    setup(destDir, target);
  });
};
