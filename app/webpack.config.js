/* eslint-disable */

const path = require('path');
const { DefinePlugin, EnvironmentPlugin, HotModuleReplacementPlugin } = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

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
        type: 'asset/resource',
      },
    ],
  },

  plugins: [
    dev && new HotModuleReplacementPlugin(),
    dev && new ReactRefreshWebpackPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin(),
    new DefinePlugin({ process: { env: {} } }),
    new CopyWebpackPlugin({ patterns: [{ from: 'static' }] }),
    new EnvironmentPlugin({
      API_URL: 'http://localhost:4242',
      WS_URL: 'ws://localhost:4242',
    }),
  ].filter(Boolean),

  devServer: {
    host: HOST,
    port: Number(PORT),
    hot: true,
    historyApiFallback: true,
    disableHostCheck: true,
  },
};
