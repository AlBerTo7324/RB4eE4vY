// 代码生成时间: 2025-10-05 03:13:25
// Import required modules
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { recognize } = require('@google-cloud/speech').v1p1beta1;

// Set up the speech recognition client
const speechClient = new recognize();

// Function to handle speech recognition
const speechRecognitionHandler = async (audioPath) => {
  try {
    // Read the audio file content
    const audioFile = await fs.promises.readFile(audioPath);

    // Configure the audio data for recognition
    const audio = { content: audioFile.toString('base64') };
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
      enableAutomaticPunctuation: true
    };
    const request = { audio, config };

    // Perform speech recognition
    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('
');

    // Output the transcription
    console.log(`Transcription: ${transcription}`);
  } catch (error) {
    console.error('Error during speech recognition:', error);
  }
};

// Create a BrowserWindow and load the index.html of the app
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the index.html of the app
  win.loadFile('index.html');

  // Open the DevTools
  win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
module.exports = { speechRecognitionHandler };