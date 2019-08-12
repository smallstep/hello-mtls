module.exports = {
  webpack: (config, { dev }) => {
    config.module.rules.push({
      test: /\.css$/,
      loader: ['css-loader'],
    });
    return config;
  },
};
