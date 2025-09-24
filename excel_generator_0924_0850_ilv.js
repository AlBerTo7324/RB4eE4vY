// 代码生成时间: 2025-09-24 08:50:11
const { app, BrowserWindow, dialog } = require('electron');
const ExcelJS = require('exceljs');
const path = require('path');

// Function to create a new Excel workbook
function createExcelWorkbook() {
  const workbook = new ExcelJS.Workbook();
  return workbook;
}

// Function to add a worksheet to the workbook
function addWorksheet(workbook) {
  const worksheet = workbook.addWorksheet('My Sheet');
  return worksheet;
}

// Function to generate random data for the Excel file
function generateRandomData(rows, cols) {
  const data = [];
  for (let i = 0; i < rows; i++) {
    data[i] = [];
    for (let j = 0; j < cols; j++) {
      data[i][j] = `Row ${i + 1}, Column ${j + 1}`;
    }
  }
  return data;
}

// Function to populate the worksheet with data
function populateWorksheet(worksheet, data) {
  worksheet.addRows(data);
}

// Function to save the Excel file
function saveExcelFile(workbook, filePath) {
  return workbook.xlsx.writeFile(filePath)
    .then(() => {
      console.log('Excel file created successfully');
    }).catch(error => {
      console.error('Failed to create Excel file:', error);
    });
}

// Electron main process
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('index.html');

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Function to handle the file save dialog
function handleSaveDialog() {
  dialog.showSaveDialog({
    buttonLabel: 'Create Excel',
    defaultPath: path.join(app.getPath('desktop'), 'NewFile.xlsx')
  }).then(result => {
    if (result.canceled) {
      console.log('User canceled the save dialog');
      return;
    }

    const { filePath } = result;
    const workbook = createExcelWorkbook();
    const worksheet = addWorksheet(workbook);
    const data = generateRandomData(10, 5); // 10 rows and 5 columns
    populateWorksheet(worksheet, data);
    saveExcelFile(workbook, filePath);
  }).catch(error => {
    console.error('Error in save dialog:', error);
  });
}

// Export the function to be called by renderer process
module.exports = { handleSaveDialog };