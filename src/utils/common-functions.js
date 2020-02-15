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
