const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

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
        filename: '[name]_[chunkhash].js',
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
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        plugins: [new TsconfigPathsPlugin()],
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
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
