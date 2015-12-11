var path = require('path');

module.exports = {
    entry: './src/main/main.jsx',
    output: {
        path: __dirname,
        filename: 'build/bundle.js'
    },
    module: {
        loaders: [
            {
                test: path.join(__dirname, 'src'),
                loader: 'babel-loader',
                query: {
                    // https://github.com/babel/babel-loader#options
                    cacheDirectory: true,
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader!autoprefixer-loader?cascade=false&browsers=last 2 version"
            },
            {
                test: /\.png$/,
                loader: "url-loader?limit=100000"
            },
            {
                test: /\.json$/,
                loader: "json"
            }
        ]
    }
};
