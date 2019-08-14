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
            loader: path.resolve('./src/doc-loader'),
          },
        ],
      },
    ];
    return config;
  },
};
