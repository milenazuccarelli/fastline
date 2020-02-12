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
  await fs.promises.mkdir(targetDir, { recursive: true });
  return fs.promises.copyFile(
    `${templatesDir}/hello-world.md`,
    `${targetDir}/hello-world.md`,
    fs.constants.COPYFILE_EXCL
  );
}
