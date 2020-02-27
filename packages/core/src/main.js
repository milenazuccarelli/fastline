"use strict";
const inquirer = require("inquirer");

import { FL } from "./config/init";
import { setup } from "./lib/initalise";
import { walk } from "./utils/common-functions";
import { templates } from "./templates.js";

export default async () => {
  const firstAnswers = await getFirstAnswers();

  const walker = await walk(firstAnswers["templates"], {
    source: firstAnswers["templates"],
    with: ""
  });

  const secondAnswers = await getSecondAnswers(walker);

  // hardcoded, but would be gathered from user input
  const templateName = "wordpress-and-node-app";

  // get the items that need to be replaced
  // depending on the template type
  const template = templates[templateName];
  let replacements = {};

  // loop through the keys for the specified template
  for (let key in template) {
    // template[key] is the field in the object i.e. %%PROXY%%
    console.log(key, template[key]);
    // prompt the user for the desired replacement
    const { target } = await getVariableReplacement(key, template[key]);
    // store the replacement in a new object, with the same
    // key as the original, so the objects have a similar structure
    replacements[key] = target;
  }

  // for demo purposes, print the user inputs
  // replacements.forEach((r) => console.log(r));

  // for demo purposes
  // loop through the template again
  for (let key in template) {
    // get the pattern to be replaced
    let pattern = template[key];
    // get the replacement
    let replacement = replacements[key];
    console.log(key, pattern, replacement);
  }

  const target = firstAnswers["target"];
  const destDir = secondAnswers["destDir"];

  // run the setup based on these answers
  setup(target, destDir);
};

async function getFirstAnswers() {
  return await inquirer.prompt([
    {
      type: "input",
      name: "target",
      message: "Enter the absolute path to your directory",
      default: function() {
        return "/Users/zucca/Documents/lacolonia/software/fastline-test";
      }
    },
    {
      type: "input",
      name: "templates",
      message: "Choose a template directory or use the default templates",
      default: function() {
        return FL.TEMPLATES_DIR;
      }
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
      default: function() {
        return value;
      }
    }
  ]);
}
