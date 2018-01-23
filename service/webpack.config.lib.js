const path = require("path");
// const paths = require("./paths");
var webpack = require("webpack");
var ManifestPlugin = require('webpack-manifest-plugin');
// var argv = require("optimist").argv;

var output = path.join(__dirname, "./dist");

module.exports = function(libArr){

    return {
        entry: {
            lib: libArr || ["jquery", "react", "react-dom"]
        },
        output: {
            path: output,
            filename: "dll.bundle.js",
            library: "dll_bundle",
        },
        plugins: [
            new webpack.DllPlugin({
                path: path.join("./dist", "manifest.json"),
                name: "[name]"
            }),
            // new ManifestPlugin({
            //     fileName: "md5.manifest.json"
            // }),
            // new webpack.optimize.UglifyJsPlugin({
            //     compress: {
            //       warnings: false,      
            //       comparisons: false,
            //       drop_console: true
            //     },
            //     output: {
            //       comments: false,      
            //       ascii_only: true
            //     },
            //     sourceMap: false
            // }),
            // new webpack.DefinePlugin({
            //     'process.env': {
            //         'NODE_ENV': JSON.stringify('production')
            //     }
            // })        
        ]
    }

    // if(argv.p) {
    //     //解决react warning问题
    //     config.plugins.push(
    //         new webpack.DefinePlugin({
    //             'process.env': {
    //                 'NODE_ENV': JSON.stringify('production')
    //             }
    //         })
    //     )
    //     // config.output.filename = "[name].bundle.[hash].js"    
    // }
}