const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: './src/main/Main.jsx',
    output: {
        path: __dirname,
        filename: 'build/bundle.js',
    },
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src/'),
        },
        extensions: ['.js', '.jsx'],
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
                                modules: false,
                            },
                        ],
                    ],
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                    },
                ],
            },
            {
                test: /\.png$/,
                loader: 'url-loader',
                options: {
                    limit: 100000,
                },
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: 'index.html',
                    to: 'build',
                },
            ],
        }),
    ],
};
