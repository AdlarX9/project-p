const fs = require('fs')
const path = require('path')
const Dotenv = require('dotenv-webpack')

module.exports = {
	entry: './src/index.js',
	mode: 'development',
	resolve: {
		extensions: ['.js', '.jsx'],
		alias: {
			'@features': path.resolve(__dirname, 'src/features'),
			'@redux': path.resolve(__dirname, 'src/redux'),
			'@components': path.resolve(__dirname, 'src/components'),
			'@app': path.resolve(__dirname, 'src/app'),
			'@contexts': path.resolve(__dirname, 'src/contexts'),
			'@pages': path.resolve(__dirname, 'src/pages'),
			'@assets': path.resolve(__dirname, 'src/assets')
		}
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-env',
							['@babel/preset-react', { runtime: 'automatic' }]
						]
					}
				}
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(png|jpg|jpeg|gif|svg)$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'src/assets/'
						}
					}
				]
			}
		]
	},
	devServer: {
		bonjour: true,
		compress: true,
		hot: true,
		liveReload: true,
		open: false,
		allowedHosts: 'all',
		port: 3000,
		host: '0.0.0.0',
		client: {
			logging: 'info',
			overlay: {
				errors: true,
				warnings: false,
				runtimeErrors: true
			},
			progress: true
		},
		historyApiFallback: true,
		server: {
			type: 'https',
			options: {
				minVersion: 'TLSv1.1',
				key: fs.readFileSync(path.join(__dirname, '../certificate/privkey.pem')),
				cert: fs.readFileSync(path.join(__dirname, '../certificate/fullchain.pem')),
				ca: fs.readFileSync(path.join(__dirname, '../certificate/chain.pem')),
				requestCert: false
			}
		}
	},
	plugins: [new Dotenv()]
}
