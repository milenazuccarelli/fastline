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
    let pathToWrite = `${target}/${pathTree}`;

    // first, copy the file
    async function copyFiles() {
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
            readFiles();
          }
        }
      );
    }
    copyFiles();

    let fileToWrite;
    let whatToWrite;

    async function readFiles() {
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

          overwriteFiles(fileToWrite);
        }
      });
    }

    async function overwriteFiles(fileToWrite) {
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
  });
}
