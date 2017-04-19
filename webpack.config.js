'use strict';

const path = require('path');
const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const IS_DEV = process.env.NODE_ENV 
    ? process.env.NODE_ENV === 'development'
    : true

const extractStyles = new ExtractTextPlugin({
    filename: '[name].css',
    disable: false,
    allChunks: true
});

function htmlWebpackPluginChunk(chunk) {
    return new HtmlWebpackPlugin({
        inject: false,
        template: require('html-webpack-template'),
        appMountId: 'root',
        mobile: true,
        devServer: false,
        links: [
            // 'https://fonts.googleapis.com/icon?family=Material+Icons',
            // 'https://fonts.googleapis.com/css?family=Roboto'
        ],
        filename: `${chunk}.html`,
        chunks: [chunk]
    })
}

module.exports = {
    context: path.join(__dirname, 'frontend'),
    entry: {
        index: ['./app']
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        library: '[name]'
    },
    target: 'electron-renderer',
    devtool: '#eval',
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.join(__dirname, 'frontend'),
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            presets: ['es2015'],
                            plugins: ['transform-object-rest-spread']
                        }
                    }
                ]
            },
            {
                test: /\.vue$/,
                include: path.join(__dirname, 'frontend'),
                use: [
                    {
                        loader: 'vue-loader',
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|otf|eot|svg|ttf|woff|html)/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.scss|\.css$/,
                include: path.join(__dirname, 'frontend'),
                use: extractStyles.extract({
                    use: [
                        { loader: 'css-loader' },
                        { loader: 'resolve-url-loader' },
                        { loader: 'postcss-loader' },
                        { loader: 'sass-loader' }
                    ],
                    fallback: 'style-loader'
                })
            }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new WebpackNotifierPlugin({title: 'Webpack'}),
        // new webpack.DefinePlugin({
        //     NODE_ENV: process.env.NODE_ENV,
        // }),
        htmlWebpackPluginChunk('index'),
        extractStyles,
    ],
    resolve: {
        extensions: ['.js', '.vue', '.scss', '.css'],
        alias: {
            'vue': 'vue/dist/vue.common.js',
            'vuex': 'vuex/dist/vuex.min.js',
            'vue-router': 'vue-router/dist/vue-router.js',
            'vue-tify': 'vuetify/dist/vuetify.min.js',
            'services': path.join(__dirname, 'frontend/services'),
            'libs': path.join(__dirname, 'libs'),
            'core': path.join(__dirname, 'core'),
            'models': path.join(__dirname, 'models'),
        }
    },
    watch: IS_DEV
};