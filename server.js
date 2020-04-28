const path = require('path');
const express = require('express');
const app = express();

const webpack = require('webpack');
const config = require('./webpack.config.js');
const compiler = webpack(config);

app.use(require("webpack-dev-middleware")(compiler, config.devServer));
app.use(require("webpack-hot-middleware")(compiler));

app.use(express.static("./assets"));

app.listen(8080, () => console.log('Server listening on port 8080 ! Please wait for webpack...'));
