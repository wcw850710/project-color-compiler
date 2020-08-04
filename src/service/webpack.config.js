const path = require('path');

module.exports = {
  entry: './index.ts',
  target: 'node',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '../../dist/service')
  },
  devtool: 'source-map',
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
};
