import fse from "fs-extra";
import { FL } from "../config/init";

/**
 * Setup
 *
 * @param destDir {String}
 * @param target {String}
 * @return {Promise}
 **/
export async function setup(destDir, target) {
  if (typeof destDir !== "string" || typeof target !== "string") {
    throw new Error(
      "Cannot execute 'setup' function. Make sure you provide destination directory and the target file or directory."
    );
  }
  const sourceDir = FL.TEMPLATES_DIR;

  return fse
    .copy(`${sourceDir}/${target}`, `${destDir}/${target}`, {
      overwrite: false,
      errorOnExist: true
    })
    .then(() => {
      console.log(`${target} has been copied to ${destDir}.`);
    })
    .catch(err => {
      console.warn(err);
    });
}
