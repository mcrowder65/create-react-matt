const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: "./src/client/index.html",
  filename: "./index.html",
  inject: "body"
});
const isProd = process.env.NODE_ENV === "production";
const sourcePath = path.join(__dirname, "./src/client");
const webpackConfig = {
  cache: true,
  entry: isProd ? "./src/client/app.jsx" : [
    "react-hot-loader/patch",
    "webpack-dev-server/client?http://localhost:8080",
    "webpack/hot/only-dev-server",
    "./src/client/app.jsx"
  ],
  output: {
    path: `${__dirname}/build`,
    filename: "bundle.js"
  },
  resolve: {
    extensions: [".js", ".scss", ".jsx", ".css"],
    modules: [sourcePath, path.resolve(__dirname, "./node_modules")],
    symlinks: false
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src"),
        loader: "babel-loader",
        exclude: /node_modules/
      }, {
        test: /\.jsx$/,
        include: path.resolve(__dirname, "src"),
        loader: "babel-loader",
        exclude: /node_modules/
      }, {
        test: /\.css$/,
        include: path.resolve(__dirname, "src"),
        // loader: 'style-loader!css-loader',
        use: [
          {
            loader: require.resolve("style-loader")
          },
          {
            loader: require.resolve("css-loader"),
            options: {
              importLoaders: 1
            }
          },
          {
            loader: require.resolve("postcss-loader"),
            options: {
              ident: "postcss",
              plugins: () => [
                require("postcss-flexbugs-fixes")
                //   autoprefixer({
                //     browsers: [
                //       '>1%',
                //       'last 4 versions',
                //       'Firefox ESR',
                //       'not ie < 9',
                //     ],
                //     flexbox: 'no-2009',
                //   }),
              ]
            }
          }
        ],
        exclude: /node_modules/
      }, {
        test: /\.scss$/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader: require.resolve("style-loader")
          },
          {
            loader: require.resolve("css-loader"),
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: "[name]__[local]___[hash:base64:5]"
            }
          },
          {
            loader: require.resolve("sass-loader")
          },
          {
            loader: require.resolve("postcss-loader"),
            options: {
              ident: "postcss",
              plugins: () => [
                require("postcss-flexbugs-fixes")
                //   autoprefixer({
                //     browsers: [
                //       '>1%',
                //       'last 4 versions',
                //       'Firefox ESR',
                //       'not ie < 9',
                //     ],
                //     flexbox: 'no-2009',
                //   }),
              ]
            }
          }
        ],
        exclude: /node_modules/
      }, {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
        include: path.resolve(__dirname, "src"),
        loader: "url-loader?limit=30000&name=[name]-[hash].[ext]",
        exclude: /node_modules/
      }
    ]

  },
  devServer: {
    historyApiFallback: true,
    hot: !isProd,
    compress: isProd,
    contentBase: "./",
    publicPath: "/"
  },
  plugins: [
    HtmlWebpackPluginConfig,
    new webpack.EnvironmentPlugin(["NODE_ENV"]),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]

};
if (!isProd) {
  webpackConfig.devtool = "sourcemap";
}
module.exports = webpackConfig;