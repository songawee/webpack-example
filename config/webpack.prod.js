const CompressionPlugin = require("compression-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const merge = require("webpack-merge");
const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const webpack = require("webpack");

const commonConfig = require("./webpack.common");

module.exports = merge(commonConfig, {
  output: {
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /.ts$/,
        use: [
          {
            loader: "awesome-typescript-loader",
            options: {
              configFileName: path.resolve(__dirname, "../tsconfig.json"),
            },
          },
        ],
        include: path.resolve(__dirname, "../src"),
      },
    ],
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new UglifyJsPlugin({
      cache: true,
      parallel: 3,
      uglifyOptions: {
        mangle: {
          keep_fnames: true,
        },
      },
      sourceMap: true,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new CompressionPlugin({
      asset: "[file].gz",
      algorithm: "gzip",
      test: /\.(css|js|html)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: ["vendor", "runtime"],
    //   minChunks: Infinity,
    // }),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
  recordsPath: path.resolve(__dirname, "../records.json"),
});
