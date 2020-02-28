// @see https://jestjs.io/docs/en/getting-started#using-babel
module.exports = {
  plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        corejs: 3
      }
    ]
  ],
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: 3,
        targets: {
          node: "current"
        }
      }
    ]
  ]
};
