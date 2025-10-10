// 代码生成时间: 2025-10-10 17:01:56
 * Features:
 * - Text editor
 * - File saving
 * - Error handling
 */

const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

// Initialize a global reference to the window
let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  win.loadFile('index.html');

  // Open the devtools.
  win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Function to handle saving the content
function saveContent(content) {
  const options = {
    filters: [
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  };
  dialog.showSaveDialog(options).then((result) => {
    if (!result.canceled && result.filePath) {
      fs.writeFile(result.filePath, content, (err) => {
        if (err) {
          dialog.showErrorBox('Error Saving File', 'An error occurred while saving the file: ' + err.message);
        } else {
          dialog.showMessageBox({
            message: 'File saved successfully!',
            buttons: ['OK'],
          });
        }
      });
    }
  });
}

// Preload script to expose saveContent function to renderer process
const preloadScript = `
  (function() {
    const { contextBridge, ipcRenderer } = require('electron');
    contextBridge.exposeInMainWorld('electronAPI', {
      saveContent: () => ipcRenderer.send('save-content'),
    });
  })();
`;

// Write the preload script to a file
fs.writeFile(path.join(__dirname, 'preload.js'), preloadScript, (err) => {
  if (err) {
    console.error('Failed to write preload script:', err);
  }
});
