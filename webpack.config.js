// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',  // 入力ファイル
  output: {
    filename: 'bundle.js',  // 出力ファイル
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development'  // または 'production'
};
