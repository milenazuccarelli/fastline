import fs from "fs";
import path from "path";

/**
 * Setup
 *
 * @return {Promise}
 * @param targetDir {String}
 **/
export async function setup(targetDir) {
  const templatesDir = path.resolve(__dirname, "../../templates");
  const fileName = "hello-world.md";
  await fs.promises.mkdir(targetDir, { recursive: true });
  return fs.promises
    .copyFile(
      `${templatesDir}/${fileName}`,
      `${targetDir}/${fileName}`,
      fs.constants.COPYFILE_EXCL
    )
    .then(() => {
      console.log(`${fileName} has been copied to ${targetDir}.`);
    })
    .catch(err => {
      console.log(
        `Could not copy ${fileName}. Probably the file is already present in the destination directory.`
      );
    });
}
