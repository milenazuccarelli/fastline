import fse from "fs-extra";
import { FL } from "../config/init";
import { walk } from "../utils/common-functions";
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

  setUpDirectory(destDir, target, keys, patterns, replacements);
}

async function setUpDirectory(destDir, target, keys, patterns, replacements) {
  const sourceDir = FL.TEMPLATES_DIR;
  let configuration = await walk(`${sourceDir}/${destDir}/config`);

  configuration.forEach(async file => {
    // construct the directory tree
    let pathTree = path.relative(`${sourceDir}/${destDir}/config`, file);
    let pathToWrite = `${target}/${pathTree}`;

    // copy the file
    copyFiles(file, pathToWrite, keys, patterns, replacements);
  });
}

async function copyFiles(file, pathToWrite, variable, keys, patterns) {
  await fse.copy(
    file,
    pathToWrite,
    {
      overwrite: false,
      errorOnExist: true
    },
    err => {
      if (err) {
        console.log(err);
      } else {
        readFiles(pathToWrite, variable, keys, patterns);
      }
    }
  );
}

async function readFiles(pathToWrite, keys, patterns, replacements) {
  let fileToWrite;
  let whatToWrite;

  await fse.readFile(pathToWrite, "utf8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let convertedExpression;

      for (let variable in keys) {
        convertedExpression = new RegExp(patterns[variable], "g");

        whatToWrite = fileToWrite ? fileToWrite : data;

        fileToWrite = whatToWrite.replace(
          convertedExpression,
          replacements[variable]
        );
      }

      overwriteFiles(pathToWrite, fileToWrite);
    }
  });
}

async function overwriteFiles(pathToWrite, fileToWrite) {
  // Ignore certain extentions path.extname(pathToWrite)

  // then overwrite
  await fse.outputFile(pathToWrite, fileToWrite, err => {
    // console.log(err); // => null

    fse.readFile(fileToWrite, "utf8", (err, data) => {
      if (err) console.log(err);
      // console.log(data); // => overwritten data
    });
  });
}
