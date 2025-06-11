import { app, BrowserWindow } from 'electron'

const createWindow = () => {
	const win = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true
			// preload: path.join(__dirname, 'preload.js') // optionnel si besoin
		}
	})

	// En développement, on pointe vers le serveur React
	win.loadURL('https://prive.pifpafdeluxe.fr')

	// En production, on charge le build React
	// win.loadFile('dist/index.html');
}

app.whenReady().then(createWindow)
