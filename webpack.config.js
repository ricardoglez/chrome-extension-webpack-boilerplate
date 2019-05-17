var webpack = require("webpack"),
    path = require("path"),
    fileSystem = require("fs"),
    env = require("./utils/env"),
    CleanWebpackPlugin = require("clean-webpack-plugin"),
    CopyWebpackPlugin = require("copy-webpack-plugin"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    WriteFilePlugin = require("write-file-webpack-plugin");

// load the secrets
var alias = {};

var secretsPath = path.join(__dirname, ("secrets." + env.NODE_ENV + ".js"));

var fileExtensions = ["jpg", "jpeg", "png", "gif", "eot", "otf", "svg", "ttf", "woff", "woff2"];

if (fileSystem.existsSync(secretsPath)) {
  alias["secrets"] = secretsPath;
}

var options = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    index: path.join(__dirname, "src", "js", "index.js"),
    popup: path.join(__dirname, "src", "js", "popup.js"),
    options: path.join(__dirname, "src", "js", "options.js"),
    background: path.join(__dirname, "src", "js", "background.js"),
    contentScript: path.join(__dirname, "src", "js", "content-script.js")
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].bundle.js"
  },
  resolve: {
    // These options change how modules are resolved
    extensions: [
      '.js',
      '.jsx',
      '.json',
      '.scss',
      '.css',
      '.jpeg',
      '.jpg',
      '.gif',
      '.png'
    ], // Automatically resolve certain extensions
    modules: [
        'node_modules',
        path.resolve( __dirname, './node_modules' ),
        path.resolve( __dirname, './src' )
    ],
    alias: {
      // Create aliases
      // images: path.resolve(__dirname, 'src/images') // src/images alias
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader",
        exclude: /node_modules/
      },
      {
        test: new RegExp('\.(' + fileExtensions.join('|') + ')$'),
        loader: "file-loader?name=[name].[ext]",
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/
      },
      {/** Images Rules */
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          // 'file-loader?context=src/images/&name=images/[path][name].[ext]',
          {
            // images loader
            loader: 'image-webpack-loader',
            options: {
              disable: process.env.NODE_ENV != 'production',
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              optipng: {
                enabled: true,
              },
              pngquant: {
                quality: '60-80',
                speed: 3
              },
              gifsicle: {
                interlaced: false
              },
            }
          },
        ],
        exclude: /node_modules/,
        // include: __dirname
      }
    ]
  },
  resolve: {
    alias: alias
  },
  plugins: [
    // clean the build folder
    new CleanWebpackPlugin(["build"]),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.EnvironmentPlugin(["NODE_ENV"]),
    new CopyWebpackPlugin([{
      from: "src/manifest.json",
      transform: function (content, path) {
        // generates the manifest file using the package.json informations
        return Buffer.from(JSON.stringify({
          description: process.env.npm_package_description,
          version: process.env.npm_package_version,
          ...JSON.parse(content.toString())
        }))
      }
    }]),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"),
      filename: "index.html",
      chunks: ["index"]
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "popup.html"),
      filename: "popup.html",
      chunks: ["popup"]
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "options.html"),
      filename: "options.html",
      chunks: ["options"]
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "background.html"),
      filename: "background.html",
      chunks: ["background"]
    }),
    new WriteFilePlugin()
  ]
};

if (env.NODE_ENV === "development") {
  options.devtool = "cheap-module-eval-source-map";
}

module.exports = options;
