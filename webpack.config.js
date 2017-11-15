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
    resolve: {
        extensions: [".js", ".jsx"]
    },
    module: {
        loaders:[
        { test: /\.jsx$/, exclude: /node_modules/, loader: 'babel-loader'},
        { test: /\.json$/, loader: 'json-loader'},
        // // { test: /\.pug$/, loader: 'pug' },
        // {test: /\.css$/, loaders: ['style-loader', 'css-loader']},
        // { test: /\.sass$/, loaders: ['style-loader', 'css-loader', 'sass-loader']},
        // { test: /\.scss$/, loader: ExtractTextPlugin.extract('style-loader','css-loader!sass-loader')},
        { test: /\.scss$/, loader: ExtractTextPlugin.extract({
                              fallback: 'style-loader',
                              use: 'css-loader!sass-loader', })
        },
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
