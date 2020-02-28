import fse from "fs-extra";
import path from "path";
import { uuid } from "uuidv4";
import { setup } from "../../src/lib/initalise";
import {
  asyncForEach,
  getRandomInt,
  walk
} from "../../src/utils/common-functions";
import { FL } from "../../src/config/init";

const DIR_BASE = path.resolve(__dirname, "../../__fixtures__");
const target = "wordpress-and-node-app";
const sourceDir = `${FL.TEMPLATES_DIR}/${target}`;

let DIR_ID, DIR, fakeContent, fakeFileRelativePath, originalFilesList;

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

  describe("when a fastline config file doens't exist", () => {
    it.skip("throws a error", () => {});
  });

  describe("when there is no setup", () => {
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

    it("replaces all occurrences found on the fastline config file", async () => {
      return fse
        .readFile(`${DIR}${fakeFileRelativePath}`, "utf8")
        .then(data => {
          let replacementContent = data.replace(/fake/g, "fakee");
          expect(replacementContent).toEqual(fakeContent);
        });
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
