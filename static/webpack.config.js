const webpack = require('webpack');
const resolve = require('path').resolve;
const config = {
	devtool: 'eval-source-map',
	entry: {
		'app': __dirname + '/js/index.jsx',
		'auth': __dirname + '/js/auth.jsx'
	},
	output:{
		path: resolve('../public'),
		filename: '[name]_bundle.js',
		publicPath: resolve('../public')
	},
	resolve: {
		extensions: ['.js','.jsx','.css', '.less']
	},
	module: {
	  rules: [
		  {
		  	test: /\.jsx?/,
		  	loader: 'babel-loader',
		  	exclude: /node_modules/,
		  	query:{
					presets: ['@babel/react']
				}
	  	},
	  	{
				test: /\.css$/,
				use: [
					{ loader: "style-loader" }
				]
  		},
  		{
	  		test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
	    }
	  ]
	}
};
module.exports = config;
