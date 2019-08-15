const fs = require('fs');
const path = require('path');

const docsPath = path.resolve(__dirname, 'docs');
const docs = fs.readdirSync(docsPath).filter(doc => doc !== 'LICENSE.txt');

module.exports = {
  entry: {
    index: './src/index.js',
    ...docs.reduce((obj, doc) => {
      obj[`docs/${doc}`] = `./docs/${doc}/config.yaml`;
      return obj;
    }, {}),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: 'chunk-[name].js',
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
