const fs = require('fs');
const path = require('path');

const common = require('./common');

const docsPath = path.resolve(__dirname, '../docs');
const docs = fs.readdirSync(docsPath).filter(doc => doc !== 'LICENSE.txt');

module.exports = {
  devtool: 'source-map',
  entry: {
    index: './src/index.js',
    ContentBlock: './src/ContentBlock.jsx',
    ...docs.reduce((obj, doc) => {
      obj[`docs/${doc}`] = `./docs/${doc}/config.yaml`;
      return obj;
    }, {}),
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    chunkFilename: 'hello-mtls-[name].js',
    library: 'HellomTLS',
    libraryTarget: 'umd',
    umdNamedDefine: true,
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
      ...common.module.rules,
    ],
  },
  externals: {
    React: 'react',
    ReactDOM: 'react-dom',
    Prism: 'prismjs',
  },
};
