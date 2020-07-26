const {
  override,
  fixBabelImports,
  useBabelRc,
  addWebpackAlias,
} = require("customize-cra");
const { addLessLoader } = require("./add-less-loader");
const path = require("path");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    // modifyVars: { '@primary-color': '#f00' },
  }),
  useBabelRc(),
  addWebpackAlias({
    "@": path.resolve(__dirname, "src"),
  })
);
