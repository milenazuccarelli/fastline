import fse from "fs-extra";
import { FL } from "../config/init";
import { asyncForEach, walk } from "../utils/common-functions";
import path from "path";

/**
 * Setup
 *
 * @param destDir {String} Absolute path
 * @param target {String} name of directory inside templates dir, eg. `my/path/to/file` (no initial slash)
 * @param keys {Array}
 * @param patterns {Array}
 * @param replacements {Array}
 * @return {Promise}
 **/
export async function setup(destDir, target, keys, patterns, replacements) {
  if (typeof destDir !== "string" || typeof target !== "string") {
    throw new Error(
      "Cannot execute 'setup' function. Make sure you provide destination directory and the target file or directory."
    );
  }

  return await setUpDirectory(destDir, target, keys, patterns, replacements);
}

/**
 * Setup Directory
 *
 * @param destDir {String} Absolute path
 * @param target {String}
 * @param keys {Array}
 * @param patterns {Array}
 * @param replacements {Array}
 **/
async function setUpDirectory(destDir, target, keys, patterns, replacements) {
  const sourceDir = FL.TEMPLATES_DIR;
  let configuration = await walk(`${sourceDir}/${destDir}/config`);

  return await asyncForEach(configuration, async file => {
    // construct the directory tree
    let pathTree = path.relative(`${sourceDir}/${destDir}/config`, file);
    let pathToWrite = `${target}/${pathTree}`;

    // copy the file
    return await copyFiles(file, pathToWrite, keys, patterns, replacements);
  });
}

/**
 * Copy Files
 *
 * @param file {String}
 * @param pathToWrite {String}
 * @param keys {Array}
 * @param patterns {Array}
 * @param replacements {Array}
 * */
async function copyFiles(file, pathToWrite, keys, patterns, replacements) {
  return await fse
    .copy(file, pathToWrite, {
      overwrite: false,
      errorOnExist: true
    })
    .then(async () => {
      return await readFiles(pathToWrite, keys, patterns, replacements);
    });
}

/**
 * Read Files
 *
 * @param pathToWrite {String}
 * @param keys {Array}
 * @param patterns {Array}
 * @param replacements {Array}
 * */
async function readFiles(pathToWrite, keys, patterns, replacements) {
  return await fse.readFile(pathToWrite, "utf8").then(async data => {
    let convertedExpression;

    let whatToWrite = data;

    for (let variable in keys) {
      convertedExpression = new RegExp(patterns[variable], "g");

      // Replace placeholder with the actual value provided by the user.
      whatToWrite = whatToWrite.replace(
        convertedExpression,
        replacements[variable]
      );
    }
    return await overwriteFiles(pathToWrite, whatToWrite);
  });
}

/**
 * Overwrite Files
 *
 * @param pathToWrite {String}
 * @param whatToWrite {String}
 * */
async function overwriteFiles(pathToWrite, whatToWrite) {
  // TODO: Ignore certain extensions path.extname(pathToWrite)
  // Overwrite file content.
  return await fse.outputFile(pathToWrite, whatToWrite);
}
