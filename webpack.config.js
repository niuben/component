const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const LiveReloadPlugin = require("webpack-livereload-plugin");
var path = require("path");

var config = {
    entry: {
        index: './lib/site/static/index.js',
        detail: "./lib/site/static/detail.js",
        edit: "./lib/site/static/edit.js"
    },
    output: {
      path: path.resolve(__dirname, "./lib/site/dist"),
      filename: "[name].bundle.js"
    },
    devtool: "source-map",    
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
            template: "./lib/site/index.html",
            filename: "index.html"
        }),
        new HtmlWebpackPlugin({
            inject: true,
            chunks: ["detail"],     
            template: "./lib/site/detail.html",
            filename: "detail.html"
        }),
        new HtmlWebpackPlugin({
            inject: true,
            chunks: ["edit"],
            template: "./lib/site/edit.html",
            filename: "edit.html"
        }),

        new ExtractTextPlugin({
            filename: "[name].css"
        }),
        new LiveReloadPlugin()
    ],
    devServer: {
      contentBase: path.resolve(__dirname, "./lib/site/dist")      
    }  
};
module.exports = config;