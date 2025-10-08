// 代码生成时间: 2025-10-09 02:29:22
// 引入必要的模块
const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

// 创建窗口的函数
function createWindow() {
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // 加载应用的HTML文件
  if (isDev) {
    win.loadURL('http://localhost:3000');
  } else {
    win.loadURL(path.join('file://', __dirname, 'dist/index.html'));
  }

  // 打开开发者工具
  if (isDev) {
    win.webContents.openDevTools();
  }
}

// 当ELECTRON完成初始化并且会话已准备好时，创建浏览器窗口
app.whenReady().then(createWindow)
  .catch(console.error);

// 当所有窗口被关闭时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 在操作系统中重新激活应用时，如果没有任何窗口打开，则重新创建应用窗口
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 错误处理
app.on('will-quit', () => {
  // 清理资源
  // 保存状态
  // 其他必要的退出操作
});

// 预加载脚本，用于注入Node.js环境
// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // 暴露API给渲染进程
  sendMessage: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  onMessage: (channel, callback) => {
    ipcRenderer.on(channel, (event, data) => callback(data));
  },
});

// 渲染进程
// index.js
document.addEventListener('DOMContentLoaded', () => {
  // 初始化UI
  // 绑定事件
  // 其他必要的初始化操作
});