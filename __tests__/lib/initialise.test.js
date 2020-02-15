import fse from "fs-extra";
import path from "path";
import { uuid } from "uuidv4";
import { setup } from "../../src/lib/initalise";
import { asyncForEach, getRandomInt } from "../../src/utils/common-functions";
import { FL } from "../../src/config/init";
import directoryTree from "directory-tree";
import _ from "lodash";

const DIR_BASE = path.resolve(__dirname, "../../__fixtures__");
const target = "wordpress-and-node-app";
const sourceDir = `${FL.TEMPLATES_DIR}/${target}`;

let filesList,
  DIR_ID,
  DIR,
  fakeContent,
  fakeFileRelativePath,
  originalFilesList,
  randomFilePath,
  targetFilesList;

afterAll(async () => {
  let filesAndDirsToRemove = [];
  await fse.readdir(DIR_BASE).then(filesAndDirs => {
    filesAndDirsToRemove = filesAndDirs.filter(f =>
      f.startsWith("initialise-")
    );
  });
  await asyncForEach(filesAndDirsToRemove, async fileOrDir => {
    await fse.remove(`${DIR_BASE}/${fileOrDir}`);
  });
});

describe("Initialise", () => {
  it("has some templates files to copy", async () => {
    // Get list of files and directories from a directory.
    const filesList = await walk(sourceDir, {
      source: sourceDir,
      with: ""
    });
    expect(filesList.length).toBeGreaterThan(0);
  });

  describe("when there is no setup", () => {
    beforeEach(async () => {
      DIR_ID = uuid();
      DIR = path.resolve(DIR_BASE, `initialise-${DIR_ID}`);
      await fse
        .readdir(sourceDir, { withFileTypes: true })
        .then(files => {
          filesList = files;
        })
        .catch(err => {
          console.error(err);
        });
      await setup(DIR, target);
    });

    it("copies all templates", async () => {
      const originalFilesList = await walk(sourceDir, {
        source: sourceDir,
        with: ""
      });
      const targetFilesList = await walk(`${DIR}/${target}`, {
        source: `${DIR}/${target}`,
        with: ""
      });
      expect(targetFilesList).toEqual(originalFilesList);
    });
  });

  describe("when a setup already exists", () => {
    beforeEach(async () => {
      DIR_ID = uuid();
      DIR = path.resolve(DIR_BASE, `initialise-${DIR_ID}`);

      originalFilesList = await walk(sourceDir, {
        source: sourceDir,
        with: ""
      });
      fakeFileRelativePath =
        originalFilesList[getRandomInt(originalFilesList.length)];
      await fse.mkdir(DIR, { recursive: true });
      fakeContent = `This is some fake content. #${DIR_ID}`;
      const fakeExistingFile = fse.createWriteStream(
        `${DIR}${fakeFileRelativePath}`
      );
      fakeExistingFile.write(fakeContent);
      fakeExistingFile.end();

      await setup(DIR, target);
      // const root = directoryTree(sourceDir);
      // // create an alias for later.
      // targetTemplateRoot = root;
      // if (root === null) {
      //   throw new Error(
      //     `The provided sourceDir doesn't exists. Please check the following path: ${sourceDir}`
      //   );
      // } else if (root.type === "directory") {
      //   const result = new findFileIfExists(root);
      //   if (typeof result.file === "undefined") {
      //     throw new Error(
      //       `No file is present in the following directory: ${sourceDir}`
      //     );
      //   }
      //   randomFilePath = result.file.path.replace(`${FL.TEMPLATES_DIR}/`, "");
      // } else {
      //   // Directory tree is actually just a file
      //   randomFilePath = root.path.replace(`${FL.TEMPLATES_DIR}/`, "");
      // }
      // console.log(randomFilePath);
    });

    it("doesn't copy the existing templates", async () => {
      return fse
        .readFile(`${DIR}${fakeFileRelativePath}`, "utf8")
        .then(data => {
          expect(data).toEqual(fakeContent);
        });
    });
  });
});

/**
 * FIND FILE IF EXISTS
 *
 * It makes use of the directory-tree package.
 * @see https://www.npmjs.com/package/directory-tree
 *
 * WARNING: This can be replaced by walkdir package.
 * @see https://www.npmjs.com/package/walkdir
 *
 * @param dir {Object} A directory-tree object.
 *
 * @example
 *
 *   const result = new findFileIfExists(root);
 *   console.log(result.file);
 *
 *   // Returns an object with the directory-tree structure of the first file found:
 *   //
 *   // {
 *   //   "path": "/photos/summer/june/windsurf.jpg",
 *   //   "name": "windsurf.jpg",
 *   //   "size": 400,
 *   //   "type": "file",
 *   //   "extension": ".jpg"
 *   // }
 **/
class findFileIfExists {
  constructor(dir) {
    this.iterateThroughDir(dir);
  }

  checkFiles(dir) {
    const files = dir.children.filter(child => child.type === "file");
    if (files.length > 0) {
      this.file = files[0];
    }
  }

  iterateThroughDir(originalDir) {
    this.checkFiles(originalDir);
    const dirs = originalDir.children.filter(
      child => child.type === "directory"
    );
    // If there are dirs.
    if (dirs) {
      // Check every dir in the current level
      this.iterateOnSameLevel(dirs);
    }
  }

  iterateOnSameLevel(dirs) {
    while (typeof this.file === "undefined" && dirs.children > 0) {
      let dir = dirs.pop();
      this.checkFiles(dir);
      if (typeof this.file === "undefined") {
        let childrenDirs = dir.children.filter(
          child => child.type === "directory"
        );
        // If there are children dirs.
        if (childrenDirs) {
          this.iterateOneLevelDeeper(childrenDirs);
        }
      }
    }
  }

  iterateOneLevelDeeper(childrenDirs) {
    while (typeof this.file === "undefined" && childrenDirs.children > 0) {
      let dir = childrenDirs.pop();
      this.iterateThroughDir(dir);
    }
  }
}

/**
 * WALK
 *
 * @param dir {String} Directory to walk through
 * @param replacePath {Object} See below
 *                             {
 *                               source: {String} // Part of path to replace
 *                               with: {String} // String you want to use
 *                             }
 *
 *
 **/
async function walk(dir, replacePath = {}) {
  let files = await fse.readdir(dir);
  files = await Promise.all(
    files.map(async file => {
      const filePath = path.join(dir, file);
      const stats = await fse.stat(filePath);
      if (stats.isDirectory()) {
        return walk(filePath, replacePath);
      } else if (stats.isFile()) {
        let sourceValue = replacePath.source || "";
        let withValue = replacePath.with || "";
        return filePath.replace(sourceValue, withValue);
      }
    })
  );

  return files.reduce((all, folderContents) => all.concat(folderContents), []);
}
