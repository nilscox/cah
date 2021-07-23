module.exports = {
  stories: ['../src/infrastructure/client/stories/*.stories.tsx'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: (config) => {
    // remove svg loader
    config.module.rules.splice(8, 1);

    config.module.rules.push({
      test: /\.svg$/,
      loader: '@svgr/webpack',
    });

    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[contenthash].[ext]',
      },
    });

    return config;
  },
};
