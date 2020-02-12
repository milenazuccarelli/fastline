import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import { uuid } from "uuidv4";
import { setup } from "../../src/lib/initalise";
import { getRandomInt } from "../../src/utils/common-functions";

const DIR_BASE = path.resolve(__dirname, "../../__fixtures__");
const TEMPLATES_DIR = path.resolve(__dirname, "../../templates");

afterAll(done => {
  rimraf(`${DIR_BASE}/initialise-*`, () => {
    done();
  });
});

describe("Initialise", () => {
  it("has some templetes files to copy", async () => {
    let filesList;
    await fs.promises.readdir(TEMPLATES_DIR).then(files => {
      filesList = files;
    });
    expect(filesList.length).toBeGreaterThan(0);
  });

  describe("when there is no setup", () => {
    it("copies at least a template", async () => {
      let filesList, DIR_ID, DIR;
      DIR_ID = uuid();
      DIR = path.resolve(DIR_BASE, `initialise-${DIR_ID}`);
      await fs.promises.readdir(TEMPLATES_DIR).then(files => {
        filesList = files;
      });
      await setup(DIR);
      const randomIndex = getRandomInt(filesList.length);
      fs.stat(`${DIR}/${filesList[randomIndex]}`, (err, stat) => {
        expect(stat).toBeInstanceOf(fs.Stats);
      });
    });

    it("copies all templates", async () => {
      let targetFilesList, originalFilesList, DIR_ID, DIR;
      DIR_ID = uuid();
      DIR = path.resolve(DIR_BASE, `initialise-${DIR_ID}`);
      await fs.promises.readdir(TEMPLATES_DIR).then(files => {
        originalFilesList = files;
      });
      await setup(DIR);
      await fs.promises.readdir(`${DIR}`).then(files => {
        targetFilesList = files;
      });
      expect(targetFilesList.length).toEqual(originalFilesList.length);
    });
  });

  describe("when a setup already exists", () => {
    it("doesn't copy the existing templates", async () => {
      let targetFilesList, originalFilesList, DIR_ID, DIR;
      DIR_ID = uuid();
      DIR = path.resolve(DIR_BASE, `initialise-${DIR_ID}`);
      await fs.promises.readdir(TEMPLATES_DIR).then(files => {
        originalFilesList = files;
      });
      const randomIndex = getRandomInt(originalFilesList.length);
      // Create a fake file in the following order: content, directory and file.
      const fakeContent = `This is some fake content: ${DIR_ID}`;
      await fs.promises.mkdir(DIR, { recursive: true });
      const fakeExistingFile = fs.createWriteStream(
        `${DIR}/${originalFilesList[randomIndex]}`
      );
      fakeExistingFile.write(fakeContent);
      fakeExistingFile.end();
      await setup(DIR);
      return fs.promises
        .readFile(`${DIR}/${originalFilesList[randomIndex]}`, "utf8")
        .then(data => {
          expect(data).toEqual(fakeContent);
        });
    });

    it.skip("copies all templates", () => {});
  });
});
