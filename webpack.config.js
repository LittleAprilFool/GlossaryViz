const path = require('path')
var webpack = require("webpack")
var ExtractTextPlugin = require("extract-text-webpack-plugin")
module.exports = {
    entry: [
        './index.js'
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
        { test: /\.js$/, loader: 'babel-loader', exclude:/node_modules/, query:{presets:['es2015']}},
        // { test: /\.json$/, loader: 'json'},
        // // { test: /\.pug$/, loader: 'pug' },
        // { test: /\.scss$/, loader: ExtractTextPlugin.extract('style-loader','css!sass')},
        // { test: /\.svg$/, loader: 'file-loader'} 
    ]},
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin("bundle.css",  {allChunks: true})
    ],
    node: {
        fs: "empty"
    }
}
