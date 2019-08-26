const path = require('path');

const ASSET_URL = 'https://d2m06gn7cjwia2.cloudfront.net';

module.exports = {
  module: {
    rules: [
      {
        test: /config\.yaml$/,
        include: [path.resolve('./docs')],
        use: [
          {
            loader: path.resolve('./src/loaders/doc-loader'),
            options: { asset_url: ASSET_URL },
          },
        ],
      },
      {
        test: /docs\.js$/,
        include: [path.resolve('./src')],
        use: [
          {
            loader: path.resolve('./src/loaders/docs-list-loader'),
            options: { asset_url: ASSET_URL },
          },
        ],
      },
    ],
  },
};
