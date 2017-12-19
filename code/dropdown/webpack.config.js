const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require("path");

var config = {
    entry: {
        index: ['./example/index.js']
    },
    output: {
            path: path.resolve(__dirname, "./build"),
        filename: "[name].bundle.js"
    },
    devtool: "source-map",
    devServer: {
        contentBase: './build'
    },
    module: {
        rules: [{
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['react', 'es2015'],
                }
            }
        },{
            test: /\.css$/,
            loader: "style-loader!css-loader"
        },{
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [{
                        loader: "css-loader",
                        options: {
                            minimize: true
                        }              
                    },{
                        loader: "sass-loader",
                        
                    }]                
                })
        },{
            test: /\.png|jpg$/,
            use: [{
                loader: "file-loader",
                options: {
                    name: "./[hash].[ext]"
                }
            }]
        }]
    },
    plugins:[
        new HtmlWebpackPlugin({
            inject: true,
            chunks: ["index"],
            template: "./example/index.html"
        }),
        new ExtractTextPlugin({
            filename: "index.css"
        }),
    ]   
};
module.exports = config;