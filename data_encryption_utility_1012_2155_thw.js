// 代码生成时间: 2025-10-12 21:55:57
const { app, BrowserWindow, ipcMain } = require('electron');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// 定义一个工具类，用于数据加密和解密
class DataEncryptionUtility {
  // 加密数据
  static encryptData(data, password) {
    const key = crypto.scryptSync(password, 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
  }

  // 解密数据
  static decryptData(encryptedData, password, iv) {
    const key = crypto.scryptSync(password, 'salt', 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

// 创建一个Electron窗口
class EncryptionWindow extends BrowserWindow {
  constructor() {
    super({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    this.loadFile('index.html');
    this.on('closed', () => {
      this = null;
    });
  }
}

const createWindow = () => {
  const win = new EncryptionWindow();
  win.webContents.on('did-finish-load', () => {
    // 向渲染进程发送加密和解密方法
    win.webContents.send('send-methods', {
      encryptData: DataEncryptionUtility.encryptData,
      decryptData: DataEncryptionUtility.decryptData,
    });
  });

  // 监听渲染进程发送的加密和解密请求
  ipcMain.on('encrypt-data', (event, arg) => {
    try {
      const { data, password } = arg;
      const { iv, encryptedData } = DataEncryptionUtility.encryptData(data, password);
      event.reply('encrypt-response', { iv, encryptedData });
    } catch (error) {
      event.reply('encrypt-error', error.message);
    }
  });

  ipcMain.on('decrypt-data', (event, arg) => {
    try {
      const { encryptedData, password, iv } = arg;
      const decryptedData = DataEncryptionUtility.decryptData(encryptedData, password, iv);
      event.reply('decrypt-response', decryptedData);
    } catch (error) {
      event.reply('decrypt-error', error.message);
    }
  });
};

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