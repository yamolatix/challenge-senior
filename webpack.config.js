const path = require("path");

module.exports = {
  mode: "development", // "production" | "development" | "none"
  entry: "./react/main.js",
  output: {
    path: __dirname,
    publicPath: "/",
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["@babel/plugin-proposal-object-rest-spread"]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  devtool: "source-map",
  context: __dirname
};
