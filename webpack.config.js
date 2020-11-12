var path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: './src/main/main.jsx',
    output: {
        path: __dirname,
        filename: 'build/bundle.js'
    },
    module: {
        rules: [
            {
                test: path.join(__dirname, 'src'),
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env',
                        [
                            '@babel/preset-react',
                            {
                                modules: false
                            }
                        ]
                    ]
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ]
            },
            {
                test: /\.png$/,
                loader: 'url-loader',
                options: {
                    limit: 100000
                }
            }
        ]
    }
};
