const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");

module.exports = {
  input: "Client/index.js",
  output: {
    file: "Client/dist/bundle.js",
    format: "iife",
    sourcemap: "inline",
  },
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs(),
  ],
};
