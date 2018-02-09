const HtmlWebpackPlugin = require("html-webpack-plugin");
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
            use: [
                {
                    loader: "style-loader"
                },{
                    loader: "css-loader",
                    // options: {
                    //     modules: true,
                    //     localIdentName: '[hash:5]'
                    // }
                },{
                    loader: "sass-loader"
                }
            ],
            // loader: "style-loader!css-loader!sass-loader"
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
    ]   
};
module.exports = config;