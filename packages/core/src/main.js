"use strict";
const inquirer = require("inquirer");
import fse from "fs-extra";

import { FL } from "./config/init";
import { setup } from "./lib/initalise";
import { walkDir } from "./utils/common-functions";

export default async () => {
  const firstAnswers = await getFirstAnswers();

  const walker = await walkDir(firstAnswers["templates"]);

  const secondAnswers = await getSecondAnswers(walker);

  const templateName = secondAnswers["destDir"];

  // get the items that need to be replaced
  // based on the template variable file
  const template = await fse.readFile(
    `${firstAnswers["templates"]}/${templateName}/template.json`
  );

  const templateJSON = JSON.parse(template);

  let replacements = {};

  // loop through the keys for the specified template
  for (let key in templateJSON) {
    // templateJSON[key] is the field in the object i.e. %%PROXY%%
    // prompt the user for the desired replacement
    const { target } = await getVariableReplacement(key, templateJSON[key]);
    // store the replacement in a new object, with the same
    // key as the original, so the objects have a similar structure
    replacements[key] = target;
  }

  // for demo purposes, print the user inputs
  // replacements.forEach((r) => console.log(r));

  let keys = [];
  let regexPatterns = [];
  let userInputReplacement = [];

  // for demo purposes
  // loop through the template again
  for (let key in templateJSON) {
    keys.push(key);

    // get the pattern to be replaced
    let pattern = templateJSON[key];
    regexPatterns.push(pattern);

    // get the replacement
    let replacement = replacements[key];
    userInputReplacement.push(replacement);
  }

  const destDir = secondAnswers["destDir"];
  const target = firstAnswers["target"];

  // run the setup based on these answers
  setup(destDir, target, keys, regexPatterns, userInputReplacement)
    .catch(error => {
      console.error("Something went wrong. Setup failed.");
      console.error(error.name);
      console.error(error.message);
      console.error(error.stack);
    })
    .then(data => {
      console.log("Hey! Setup complete.");
    });
};

async function getFirstAnswers() {
  return await inquirer.prompt([
    {
      type: "input",
      name: "target",
      message: "Enter the absolute path to your directory",
      default: process.cwd()
    },
    {
      type: "input",
      name: "templates",
      message:
        "Choose a template directory or use the default templates (hit ENTER to select default)",
      default: FL.TEMPLATES_DIR
    }
  ]);
}

async function getSecondAnswers(walker) {
  return await inquirer.prompt([
    {
      type: "list",
      name: "destDir",
      message: "Choose a template",
      choices: walker
    }
  ]);
}

async function getVariableReplacement(key, value) {
  return await inquirer.prompt([
    {
      type: "input",
      name: "target",
      message: `Enter the value for your ${key}`,
      default: value
    }
  ]);
}
