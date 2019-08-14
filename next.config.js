const path = require('path');

module.exports = {
  webpack: (config, { dev }) => {
    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.css$/,
        loader: ['css-loader'],
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
    ];
    return config;
  },
};
