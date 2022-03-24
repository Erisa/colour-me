const path = require('path');

module.exports = {
  output: {
    filename: 'worker.js',
    path: path.join(__dirname, 'dist')
  },
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [],
    fallback: {
      zlib: false,
      https: false,
      fs: false,
      fastify: false,
      express: false,
      path: false
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        }
      }
    ]
  }
};
