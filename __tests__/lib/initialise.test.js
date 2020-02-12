import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import { uuid } from "uuidv4";
import { setup } from "../../src/lib/initalise";
import { getRandomInt } from "../../src/utils/common-functions";

const DIR_BASE = path.resolve(__dirname, "../../__fixtures__");
const TEMPLATES_DIR = path.resolve(__dirname, "../../templates");

let filesList,
  DIR_ID,
  DIR,
  fakeContent,
  originalFilesList,
  randomIndex,
  targetFilesList;

afterAll(done => {
  rimraf(`${DIR_BASE}/initialise-*`, () => {
    done();
  });
});

describe("Initialise", () => {
  it("has some templates files to copy", async () => {
    await fs.promises.readdir(TEMPLATES_DIR).then(files => {
      filesList = files;
    });
    expect(filesList.length).toBeGreaterThan(0);
  });

  describe("when there is no setup", () => {
    beforeEach(async () => {
      DIR_ID = uuid();
      DIR = path.resolve(DIR_BASE, `initialise-${DIR_ID}`);
      await fs.promises.readdir(TEMPLATES_DIR).then(files => {
        filesList = files;
      });
      await setup(DIR);
    });

    it("copies at least a template", async () => {
      const randomIndex = getRandomInt(filesList.length);
      fs.stat(`${DIR}/${filesList[randomIndex]}`, (err, stat) => {
        expect(stat).toBeInstanceOf(fs.Stats);
      });
    });

    it("copies all templates", async () => {
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
    beforeEach(async () => {
      DIR_ID = uuid();
      DIR = path.resolve(DIR_BASE, `initialise-${DIR_ID}`);
      await fs.promises.readdir(TEMPLATES_DIR).then(files => {
        originalFilesList = files;
      });
      randomIndex = getRandomInt(originalFilesList.length);
      // Create a fake file in the following order: content, directory and file.
      fakeContent = `This is some fake content: ${DIR_ID}`;
      await fs.promises.mkdir(DIR, { recursive: true });
      const fakeExistingFile = fs.createWriteStream(
        `${DIR}/${originalFilesList[randomIndex]}`
      );
      fakeExistingFile.write(fakeContent);
      fakeExistingFile.end();
      await setup(DIR);
    });

    it("doesn't copy the existing templates", async () => {
      return fs.promises
        .readFile(`${DIR}/${originalFilesList[randomIndex]}`, "utf8")
        .then(data => {
          expect(data).toEqual(fakeContent);
        });
    });

    it("copies all templates", async () => {
      await fs.promises.readdir(`${DIR}`).then(files => {
        targetFilesList = files;
      });
      expect(targetFilesList.length).toEqual(originalFilesList.length);
    });
  });
});
