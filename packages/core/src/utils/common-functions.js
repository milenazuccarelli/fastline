import fse from "fs-extra";
import path from "path";

/**
 * GET RANDOM INT
 *
 * @param  max {Number}
 * @return {Number}
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 **/
export function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/**
 * ASYNC FOR EACH
 *
 * @param array {Array}
 * @param callback {Function}
 *
 * @example
 *
 *   const start = async () => {
 *     await asyncForEach([1, 2, 3], async (num) => {
 *       await waitFor(50);
 *       console.log(num);
 *     });
 *     console.log('Done');
 *   }
 *   start();
 *
 * @see https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
 **/
export async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
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
 * @return {Array} Array of the paths of all files found
 **/
export async function walk(dir, replacePath = {}) {
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
