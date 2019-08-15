const path = require('path');

module.exports = {
  module: {
    rules: [
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
};
