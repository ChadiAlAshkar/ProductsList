const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const WebpackConfig = {

  // Source map type
  // @see https://webpack.js.org/configuration/devtool/
  devtool: 'eval-source-map',

  entry: {
    //  Webpack dev server
    'devServer': `webpack-dev-server/client?http://0.0.0.0:3031`,

    // Plugin entry points
    'control/content/JS/app': path.join(__dirname, '../src/control/content/JS/app.js'),
    // 'control/design/design': path.join(__dirname, '../src/control/design/design.js'),
    // 'control/settings/settings': path.join(__dirname, '../src/control/settings/settings.js'),
    'control/introduction/app': path.join(__dirname, '../src/control/introduction/app.js'),
    'control/strings/JS/app': path.join(__dirname, '../src/control/strings/JS/stringsUI.js'),
    'widget/JS/app': path.join(__dirname, '../src/widget/JS/app.js'),
  },

  output: {
    path: path.join(__dirname, '../'),
    filename: '[name].js',
    publicPath: 'http://0.0.0.0:3031/'
  },

  externals: {
    buildfire: 'buildfire'
  },

  module: {
    rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'control/content/index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
      template: path.join(__dirname, '../src/control/content/index.html'),
      chunks: ['control/content/JS/app']
    }),
    new HtmlWebpackPlugin({
      filename: 'control/introduction/index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
      template: path.join(__dirname, '../src/control/introduction/index.html'),
      chunks: ['control/introduction/app']
    }),
    new HtmlWebpackPlugin({
      filename: 'control/strings/index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
      template: path.join(__dirname, '../src/control/strings/index.html'),
      chunks: ['control/strings/JS/app']
    }),
    // new HtmlWebpackPlugin({
    //   filename: 'control/design/index.html',
    //   inject: true,
    //   minify: { removeComments: true, collapseWhitespace: true },
    //   template: path.join(__dirname, '../src/control/design/index.html'),
    //   chunks: ['control/design/design']
    // }),
    // new HtmlWebpackPlugin({
    //   filename: 'control/settings/index.html',
    //   inject: true,
    //   minify: { removeComments: true, collapseWhitespace: true },
    //   template: path.join(__dirname, '../src/control/settings/index.html'),
    //   chunks: ['control/settings/settings']
    // }),
    new HtmlWebpackPlugin({
      filename: 'widget/index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
      template: path.join(__dirname, '../src/widget/index.html'),
      chunks: ['widget/JS/app']
    }),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, '../src/control'),
      to: path.join(__dirname, '../control'),
    }, {
      from: path.join(__dirname, '../src/widget'),
      to: path.join(__dirname, '../widget'),
    }, {
      from: path.join(__dirname, '../src/resources'),
      to: path.join(__dirname, '../resources'),
    }], {
      ignore: ['*.js', '*.html', '*.md']
    }),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, '../../../styles'),
      to: path.join(__dirname, '../styles'),
    }, {
      from: path.join(__dirname, '../../../scripts'),
      to: path.join(__dirname, '../scripts'),
    }, {
      from: path.join(__dirname, '../../../fonticons'),
      to: path.join(__dirname, '../fonticons'),
    }])
  ],

  devServer: {
    port: 3031,
    host: '0.0.0.0',
    inline: true,
    contentBase: path.join(__dirname, '../dist'),
    publicPath: '/',
    quiet: false,
    noInfo: false,
    disableHostCheck: true,
  }

};

module.exports = WebpackConfig;