
'use strict';

const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const javascript = {
    test: /\.js$/,
    use:[{
        loader: 'babel-loader',
        options: {presets:['react','env']}
    }]
};

const style = {
    test: /\.css$/,
    use:['syle-loader','css-loader']
};



const config = {
    entry: {
        //for multiple entry points
        App: './public/js/entry.js'
    },
    output:{
        path: path.resolve(__dirname, 'public', 'dist'),
        filename: '[name].bundle.js'

    },
    module:{
        rules:[javascript, style]
    },
    plugins: [
        new UglifyJsPlugin({
            sourceMap: true
        }),

    ]
};

process.noDeprecation = true;


module.exports = config;