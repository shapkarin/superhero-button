const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const dir = path.resolve(__dirname, "./src/");

function configure (filename, opts = {}) {
  return (env, argv) => ({
    entry: {
      [filename]: './superhero-button.js',
      'style': './style.scss'
    },
    context: dir,
    output: {
      path: __dirname + '/dist',
      filename:'[name]',
      library: 'superheroButton',
      libraryExport: "default",
      libraryTarget: 'umd'
    },
    node: {
      fs: 'empty'
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
          test: /\.scss$/i,
          use: [
            MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'
          ],
        },
        {
          test: /\.(png|jpg|gif)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: 'images/[name]-[hash:8].[ext]'
              },
            },
          ],
        },
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].css" 
      }),
      new webpack.DefinePlugin({
        global: 'window',
          'process.env': {
            INLINE_CSS: JSON.stringify(opts.inlineCss),
          },
      }),
      new CleanWebpackPlugin({
        cleanAfterEveryBuildPatterns: ['*', '!*.css', '!*.js'],
        protectWebpackAssets: false
      })
    ],
  });
}
module.exports = [
  configure('superhero-button.styles.js', { inlineCss: true }),
  configure('superhero-button.js'),
];