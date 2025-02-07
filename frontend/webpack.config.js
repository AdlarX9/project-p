const fs = require('fs')
const path = require('path')
const Dotenv = require('dotenv-webpack')

module.exports = {
	entry: './src/index.js',
	mode: 'development',
	resolve: {
		extensions: ['.js', '.jsx']
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
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
			// webSocketTransport: 'ws',
			// webSocketURL: 'wss://prive.pifpafdeluxe.fr:3000/ws'
		},
		// proxy: {
		// 	'/ws': {
		// 		target: 'wss://prive.pifpafdeluxe.fr:3000',
		// 		ws: true,
		// 		changeOrigin: true,
		// 		logLevel: 'info'
		// 	}
		// },
		// webSocketServer: 'ws',
		historyApiFallback: true,
		https: true,
		server: {
			type: 'https',
			options: {
				minVersion: 'TLSv1.1',
				key: fs.readFileSync(path.join(__dirname, './certificate/privkey1.pem')),
				cert: fs.readFileSync(path.join(__dirname, './certificate/fullchain1.pem')),
				ca: fs.readFileSync(path.join(__dirname, './certificate/cert1.pem')),
				requestCert: false
			}
		}
	},
	plugins: [new Dotenv()]
}
