/* eslint-disable */

const path = require('path');
const { DefinePlugin, EnvironmentPlugin, HotModuleReplacementPlugin } = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { NODE_ENV = 'development', HOST = '0.0.0.0', PORT = '8000' } = process.env;
const dev = NODE_ENV === 'development';

module.exports = {
  mode: dev ? 'development' : 'production',
  devtool: 'source-map',

  entry: './src/index.ts',

  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          target: 'es6',
        },
      },

      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },

      {
        test: /\.svg$/,
        loader: '@svgr/webpack',
      },

      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[contenthash].[ext]',
        },
      },
    ],
  },

  plugins: [
    dev && new HotModuleReplacementPlugin(),
    dev && new ReactRefreshWebpackPlugin(),
    new HtmlWebpackPlugin(),
    new DefinePlugin({ process: { env: {} } }),
    new EnvironmentPlugin({
      API_URL: 'http://localhost:4242',
    }),
  ].filter(Boolean),

  devServer: {
    host: HOST,
    port: Number(PORT),
    hot: true,
    historyApiFallback: true,
  },
};
