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

  // go through all the files
  let configuration = await walk(`${sourceDir}/${destDir}/config`);

  configuration.forEach(async file => {
    // first, copy the file
    await fse.copy(
      file,
      `${target}/${destDir}/${path.basename(file)}`,
      {
        overwrite: false,
        errorOnExist: true
      },
      err => {
        if (err) return console.error(err);
      }
    );

    // replace our variables and write to the file
    await fse.readFile(file, "utf8").then(data => {
      let newData;

      for (let variable in keys) {
        let myConvertedExpression = new RegExp(patterns[variable], "g");
        newData = data.replace(myConvertedExpression, replacements[variable]);
      }

      fse.outputFile(file, newData, err => {
        console.log(err); // => null

        fse.readFile(file, "utf8", (err, data) => {
          if (err) return console.error(err);
          console.log(data); // => replaced file
        });
      });
    });
  });
}
