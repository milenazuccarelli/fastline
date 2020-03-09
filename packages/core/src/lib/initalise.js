import fse from "fs-extra";
import { FL } from "../config/init";
import { walk } from "../utils/common-functions";
import path from "path";

/**
 * Setup
 *
 * @param destDir {String} Absolute path
 * @param target {String} name of directory inside templates dir, eg. `my/path/to/file` (no initial slash)
 * @return {Promise}
 **/
export async function setup(destDir, target, keys, patterns, replacements) {
  if (typeof destDir !== "string" || typeof target !== "string") {
    throw new Error(
      "Cannot execute 'setup' function. Make sure you provide destination directory and the target file or directory."
    );
  }

  setUpDirectory(destDir, target, keys, patterns, replacements);
}

async function setUpDirectory(destDir, target, keys, patterns, replacements) {
  const sourceDir = FL.TEMPLATES_DIR;
  let configuration = await walk(`${sourceDir}/${destDir}/config`);

  configuration.forEach(async file => {
    // construct the directory tree
    let pathTree = path.relative(`${sourceDir}/${destDir}/config`, file);
    let pathToWrite = `${target}/${destDir}/${pathTree}`;

    // first, copy the file
    await fse.copy(file, pathToWrite, {
      overwrite: false,
      errorOnExist: true
    });

    let fileToWrite = await fse.readFile(pathToWrite, "utf8");
    let convertedExpression;

    for (let variable in keys) {
      convertedExpression = new RegExp(patterns[variable], "g");
      fileToWrite = fileToWrite.replace(
        convertedExpression,
        replacements[variable]
      );
    }

    // then overwrite
    await fse.outputFile(pathToWrite, fileToWrite, err => {
      // console.log(err); // => null

      fse.readFile(fileToWrite, "utf8", (err, data) => {
        if (err) return err;
        // console.log(data); // => overwritten data
      });
    });
  });
}
