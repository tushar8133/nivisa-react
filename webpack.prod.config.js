const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: "production",
	entry: {
		main: "./src/index.js"
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name]-bundle.js"
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			use: [{
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env', "@babel/preset-react"]
				}
			}]
		}]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({template: "./src/template.html"}),
		new CopyWebpackPlugin([{from:'assets',to:'assets'}])
	]
}