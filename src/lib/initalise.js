import fs from "fs";
import { FL } from "../config/init";

/**
 * Setup
 *
 * @return {Promise}
 * @param destDir {String}
 **/
export async function setup(destDir) {
  // Get filename.
  const fileName = "hello-world.md";
  // Create the destination directory.
  await fs.promises.mkdir(destDir, { recursive: true });
  // Copy the file to destination directory.
  return fs.promises
    .copyFile(
      `${FL.TEMPLATES_DIR}/${fileName}`,
      `${destDir}/${fileName}`,
      fs.constants.COPYFILE_EXCL
    )
    .then(() => {
      console.log(`${fileName} has been copied to ${destDir}.`);
    })
    .catch(err => {
      console.log(
        `Could not copy ${fileName}. Probably the file doesn't exists or a copy is already present in the destination directory.`
      );
    });
}
