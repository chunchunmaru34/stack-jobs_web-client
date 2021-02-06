const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        main: './src/index.tsx',
        vendor: [
            'react',
            'react-dom',
            'mapbox-gl',
            // 'ramda',
        ],
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name]_[hash].js',
        chunkFilename: '[chunkhash].js',
    },
    devtool: 'source-map',
    mode: process.env.NODE_ENV || 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: '/node_modules/',
                use: [
                    {
                        loader: 'ts-loader',
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx'],
    },
    optimization: {
        // splitChunks: {
        //     chunks: 'all',
        // },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './template.html',
        }),
        new DotenvPlugin(),
        new CleanWebpackPlugin(),
    ],
};
