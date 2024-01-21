const path = require('path');
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');
const api = require("./api");

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  mode: isDev ? 'development' : 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
      '@master': path.join(__dirname, 'src/master'),
      '@pages': path.join(__dirname, 'src/pages'),
      '@sections': path.join(__dirname, 'src/sections'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              // import: false, // disable @import at-rules handling
              importLoaders: 2,
              // 0 => no loaders (default)
              // 1 => postcss-loader
              // 2 => postcss-loader, sass-loader
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: {
                  tailwindcss: {},
                  autoprefixer: {},
                },
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|jpe?g|ico)$/,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name].[hash:8][ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
    ],
  },
  // enable HMR with live reload
  devServer: {
    port: 8000,
    open: false,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    watchFiles: {
      // live reload: watch changes in source directories
      paths: ['src/**/*.html', 'src/**/*.scss', 'src/**/*.js'],
      options: {
        usePolling: true,
      },
    },
  },
  plugins: [
    new HtmlBundlerPlugin({
      entry: 'src/pages/',
      data: {
        api
      },
      js: {
        filename: 'scripts/[name].[contenthash:8].js',
      },
      css: {
        filename: 'css/[name].[contenthash:8].css',
      },
      loaderOptions: {
        root: __dirname,
        preprocessor: 'nunjucks',
        preprocessorOptions: {
          views: ['src'],
          autoescape: true, // escape dangerous characters, defaults 'true'
        },
      },
    }),
  ],
};
