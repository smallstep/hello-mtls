const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    chunkFilename: '[name].js',
    library: 'hello-mtls',
    libraryTarget: 'umd',
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
        resolve: {
          extensions: ['.js', '.jsx'],
        },
      },
      {
        test: /config\.yaml$/,
        include: [path.resolve('./docs')],
        use: [
          {
            loader: path.resolve('./src/loaders/doc-loader'),
          },
        ],
      },
      {
        test: /docs\.js$/,
        include: [path.resolve('./src')],
        use: [
          {
            loader: path.resolve('./src/loaders/docs-list-loader'),
          },
        ],
      },
    ],
  },
  externals: {
    React: 'react',
    ReactDOM: 'react-dom',
    Prism: 'prismjs',
  },
};
