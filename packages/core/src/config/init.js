import path from "path";

/**
 * FL
 *
 * This is the main class of the package.
 * Use this class to store configuration settings that will need to
 *   be referenced among the entire package.
 **/
export class FL {
  /**
   * TEMPLATES_DIR constant
   *
   * @return {String} The templates absolute path.
   * @example
   *   console.log(FL.TEMPLATES_DIR);
   *   // '/path/to/package/templates'
   **/
  static get TEMPLATES_DIR() {
    return path.resolve(this.BASE_DIR, "./packages/core/templates");
  }

  /**
   * BASE_DIR constant
   *
   * @return {String} The absolute path of Fastline root directory.
   * @example
   *   console.log(FL.TEMPLATES_DIR);
   *   // '/path/to/package/templates'
   **/
  static get BASE_DIR() {
    if (__dirname.includes(`/${this.MODULE_NAME}/`)) {
      return path.join(__dirname.split(this.MODULE_NAME)[0], this.MODULE_NAME);
    } else {
      throw new Error(
        `Impossible to setup BASE_DIR. Fastline module must be either installed inside \`node_modules\` directory or clone inside a directory named \`f${this.MODULE_NAME}\`.`
      );
    }
  }

  /**
   * NODE_MODULES_DIR constant
   *
   * @return {String|null} The absolute path of the `node_modules` folder in which
   *                      the module is contained.
   * @example
   *   console.log(FL.NODE_MODULES_DIR);
   *   // `/path/to/node_modules`
   **/
  static get NODE_MODULES_DIR() {
    if (__dirname.includes("node_modules")) {
      // https://stackoverflow.com/questions/60400848/how-to-get-apps-node-modules-absolute-path-from-my-npm-package
      return path.join(__dirname.split("node_modules")[0], "node_modules");
    } else {
      return null;
    }
  }

  /**
   * MODULE_NAME constant
   *
   * @return {String} The name the module should have. I say should because it's hardcoded.
   **/
  static get MODULE_NAME() {
    return "fastline";
  }
}

export const Fastline = new FL();
