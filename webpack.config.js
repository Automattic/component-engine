/* globals module */
module.exports = {
	module: {
		loaders: [
			{
				test: /\.json$/,
				loader: 'json',
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
		],
	},
	entry: {
		app: './src/app.js',
	},
	output: {
		path: './build',
		filename: '[name].js'
	},
	node: {
		fs: 'empty'
	}
};
