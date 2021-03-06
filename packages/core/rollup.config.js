import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "rollup-plugin-babel";

export default {
  input: "src/main.js",
  output: {
    file: "lib/bundle.js",
    format: "cjs"
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: "node_modules/**", // only transpile our source code
      runtimeHelpers: true
    })
  ]
};
