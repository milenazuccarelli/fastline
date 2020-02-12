const fs = require("fs");
const path = require("path");

/**
 * Setup
 *
 * @return {Promise}
 * @param targetDir {String}
 **/
async function setup(targetDir) {
  const templatesDir = path.resolve(__dirname, "../../templates");
  await fs.promises.mkdir(targetDir, { recursive: true });
  return fs.promises.copyFile(
    `${templatesDir}/hello-world.md`,
    `${targetDir}/hello-world.md`,
    fs.constants.COPYFILE_EXCL
  );
}

module.exports = {
  setup
};
