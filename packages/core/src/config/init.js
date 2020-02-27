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
    return path.resolve(__dirname, "../../templates");
  }
  /**
   * BASE_DIR constant
   *
   * @return {String} The absolute path of the directory in which package json is in.
   * @example
   *   console.log(FL.TEMPLATES_DIR);
   *   // '/path/to/package/templates'
   **/
  static get BASE_DIR() {
    return path.resolve(__dirname, "../../");
  }
}

export const Fastline = new FL();
