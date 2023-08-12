const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyFilePlugin = require("copy-webpack-plugin");
const InlineSourceWebpackPlugin = require('inline-source-webpack-plugin');

const PUBLIC_URL = '/build';
const OUTPUT_DIR = `${__dirname}/build`;

module.exports = {
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: "development",

  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: "./src/ts/index.ts",
  // ファイルの出力設定
  output: {
    //  出力ファイルのディレクトリ名
    path: OUTPUT_DIR,
    // 出力ファイル名
    filename: "main.js",
    publicPath: PUBLIC_URL
  },
  module: {
    rules: [
      {
        // 拡張子 .ts の場合
        test: /\.ts$/,
        // TypeScript をコンパイルする
        use: "ts-loader"
      }, {
        test: /\.s?css$/,
        use: [{
          loader: MiniCssExtractPlugin.loader
        }, {
          loader: "css-loader"
        }, {
          loader: "sass-loader"
        }]
      }, {
        test: /\.svg$/,
        use: [
          {
            loader: "svg-url-loader"
          }
        ]
      }, {
        test: /\.pug$/,
        use: [
          {
            loader: "html-loader"
          }, {
            loader: "pug-html-loader",
            options: {
              data: {
                PUBLIC_URL: PUBLIC_URL
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/pug/index.html.pug',
      filename: 'index.html',
      templateParameters: {
        PUBLIC_URL: PUBLIC_URL,
      },
    }),
    new MiniCssExtractPlugin(),
    new CopyFilePlugin({
      patterns: [{
        from: "./src/static/favicon.svg",
        to: OUTPUT_DIR
      }]
    }),
    new InlineSourceWebpackPlugin({
      compress: true,
      rootpath: './src',
      noAssetMatch: 'warn'
    }),
  ],
  // import 文で .ts や .tsx ファイルを解決するため
  resolve: {
    extensions: [".ts", ".js", ".json"]
  },
  // ES5(IE11等)向けの指定（webpack 5以上で必要）
  target: ["web", "es5"],
};