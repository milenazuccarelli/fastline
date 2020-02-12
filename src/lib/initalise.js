import fs from "fs";
import { FL } from "../config/init";

/**
 * Setup
 *
 * @return {Promise}
 * @param targetDir {String}
 **/
export async function setup(targetDir) {
  const fileName = "hello-world.md";
  await fs.promises.mkdir(targetDir, { recursive: true });
  return fs.promises
    .copyFile(
      `${FL.TEMPLATES_DIR}/${fileName}`,
      `${targetDir}/${fileName}`,
      fs.constants.COPYFILE_EXCL
    )
    .then(() => {
      console.log(`${fileName} has been copied to ${targetDir}.`);
    })
    .catch(err => {
      console.log(
        `Could not copy ${fileName}. Probably the file doesn't exists or a copy is already present in the destination directory.`
      );
    });
}
