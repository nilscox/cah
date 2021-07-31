const path = require('path');

module.exports = {
  stories: ['../src/infrastructure/client/stories/*.stories.tsx'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@react-theming/storybook-addon'],
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

    // https://github.com/storybookjs/storybook/issues/10231#issuecomment-862728737
    config.resolve.alias = {
      ...config.resolve.alias,
      '@emotion/core': path.resolve('node_modules/@emotion/react'),
      '@emotion/styled': path.resolve('node_modules/@emotion/styled'),
      'emotion-theming': path.resolve('node_modules/@emotion/react'),
      '@emotion/react': path.resolve('node_modules/@emotion/react'),
    };

    return config;
  },
};
