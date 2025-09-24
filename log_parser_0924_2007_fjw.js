// 代码生成时间: 2025-09-24 20:07:39
const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

// Function to parse the log file
function parseLogFile(logFilePath) {
  try {
    const logData = fs.readFileSync(logFilePath, 'utf-8');
    const logEntries = logData.split('
');
    const parsedEntries = logEntries.map(entry => {
      // Implement the parsing logic based on the log file format
      // This is a placeholder, replace with actual parsing logic
      return { message: entry };
    });
    return parsedEntries;
  } catch (error) {
    console.error('Error parsing log file:', error);
    throw error;
  }
}

// Create window function
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  win.loadFile('index.html');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS, it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Handle file opening
app.on('will-finish-launching', () => {
  app.on('open-file', (e, path) => {
    e.preventDefault();
    createWindow();
    const parsedLogs = parseLogFile(path);
    // Handle parsed logs, possibly send to renderer process
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});