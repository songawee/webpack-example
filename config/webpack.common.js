const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const rxPaths = require("rxjs/_esm5/path-mapping");
const webpack = require("webpack");

module.exports = {
  entry: {
    app: path.resolve(__dirname, "../src/index.ts"),
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/",
  },
  resolve: {
    alias: rxPaths(),
    extensions: [".ts", ".js", ".html", ".css", ".scss", ".png"],
  },
  module: {
    rules: [],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};
