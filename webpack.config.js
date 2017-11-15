const path = require('path')
var webpack = require("webpack")
var ExtractTextPlugin = require("extract-text-webpack-plugin")
module.exports = {
    entry: [
        './src/main.jsx'
    ],
    output: {
        path: __dirname + '/dist/',
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    devServer: {
        port: '8080',
        hot: true,
        inline: true,
        progress: true
    },
    module: {
        loaders:[
        { test: /\.jsx$/, loader: 'babel-loader'},
        { test: /\.json$/, loader: 'json'},
        // // { test: /\.pug$/, loader: 'pug' },
        { test: /\.scss$/, loader: ExtractTextPlugin.extract('style-loader','css!sass')},
        { test: /\.svg$/, loader: 'file-loader'} 
    ]},
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin("bundle.css",  {allChunks: true})
    ],
    node: {
        fs: "empty"
    }
}
