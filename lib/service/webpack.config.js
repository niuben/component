const path = require("path");
const paths = require("./paths");
var webpack = require("webpack");
var ManifestPlugin = require('webpack-manifest-plugin');
var argv = require("optimist").argv;


module.exports = function(moduleName, entry, alias){
  var output = path.join(paths["dist"], moduleName);    
  return {
    entry: entry,
    output: {
        path: output,
        filename: "dll.bundle.js",
        library: "dll_bundle",
        devtoolModuleFilenameTemplate: function(infor){
          console.log("infor", infor);
        }
    },  
    resolve: {
        extensions: [".js", ".jsx"],
        alias: alias
    },
    plugins: [
        // new webpack.DllPlugin({
        //   path: path.join(output, "manifest.json"),
        //   name: "[name]",
        //   context: path.join(paths["source"])
        // }),

        // new webpack.EnvironmentPlugin({
        //   NODE_ENV: "production",
        //   BABEL_ENV: "production"
        // })
        // new ManifestPlugin({
        //     isChunk: true,
        //     isAsset: true,
        //     isModuleAsset: true
        // })
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false,       
            comparisons: false,
            drop_console: true
          },
          output: {
            comments: false,
            ascii_only: true
          },
          sourceMap: false
        }), 
    ],
    module: {
        strictExportPresence: true,
        rules: [              
          {
            oneOf: [
              {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: require.resolve("url-loader"),
                options: {
                  limit: 10000,
                  name: "static/media/[name].[hash:8].[ext]"
                }
              },
    
              {
                test: /\.(js|jsx)$/,
                // include: paths.appSrc,
                loader: require.resolve("babel-loader"),
                options: {
                  presets: ["react", "es2015", "stage-0", "stage-1", "stage-2", "stage-3"],
                  cacheDirectory: true,                      
                }
              },
    
              {
                test: /\.css$/,
                use: [
                  require.resolve("style-loader"),
                  {
                    loader: require.resolve("css-loader"),
                    options: {
                      importLoaders: 1
                    }
                  }              
                ]
              },
              {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader"
                  },{
                    loader: "css-loader"
                  },{
                    loader: "sass-loader"
                  }]
              },
              {
                exclude: [/\.js$/, /\.html$/, /\.json$/],
                loader: require.resolve("file-loader"),
                options: {
                  name: "static/media/[name].[hash:8].[ext]"
                }
              }
            ]
          }
        ]
      }      
    }   
}