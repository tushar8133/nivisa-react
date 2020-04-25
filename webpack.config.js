const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {
	CleanWebpackPlugin
} = require('clean-webpack-plugin');


module.exports = {
	mode: "development",
	devtool: "source-map",
	watch: false, // working only for html files. Changes in other files will break it.
	devServer: {
		contentBase: path.join(__dirname, 'assets'),
		contentBasePublicPath: '/assets'
	},
	entry: {
		main: "./src/index.js"
	},
	output: {
		path: path.resolve(__dirname, "dist"), // __dirname or process.cwd (current working directory),
		filename: "[name]-bundle.js"
	},
	module: {
		rules: [{
			test: /\.(js|jsx)$/,
			exclude: /node_modules/,
			use: [{
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env', "@babel/preset-react"]
				}
			}]
		}, {
			test: /\.scss$/,
			use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
		}]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin(),
		new HtmlWebpackPlugin({
			template: "./src/template.html"
		})
	]
}