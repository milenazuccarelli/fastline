import fs from "fs";
import path from "path";
import { uuid } from "uuidv4";
import { setup } from "../../src/lib/initalise";

const DIR_BASE = path.resolve(__dirname, "../../__fixtures__/initialise");

describe("Initialise", () => {
  describe("when there is no setup", () => {
    it("copies all templates", async () => {
      const filePath = "hello-world.md";
      const DIR_ID = uuid();
      const DIR = path.resolve(DIR_BASE, `initialise-${DIR_ID}`);
      await setup(DIR);
      // return expect(fs.promises.access(filePath, fs.constants.F_OK)).rejects.toThrowError()
      // return expect(fs.promises.access(filePath, fs.constants.F_OK)).resolves.toBeUndefined();
      return expect(
        fs.promises.stat(`${DIR}/${filePath}`)
      ).resolves.toBeInstanceOf(fs.Stats);
    });
  });
  describe("when a setup already exists", () => {
    it.skip("copies all templates", () => {});
    it.skip("doesn't copy the template", () => {});
  });
});
