



module.exports = {
  entry: {
    Jrtc: "./src/jrtc.js",
    Viewer: "./src/viewer.js"
  },
  output: {
    path: __dirname + "/dist/javascripts",
    filename: "[name].bundle.js",
    publicPath: '/',
    library: "[name]",
    libraryTarget: "umd"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ["es2015"],
          cacheDirectory: false
        }
      }
    ]
  }
};

