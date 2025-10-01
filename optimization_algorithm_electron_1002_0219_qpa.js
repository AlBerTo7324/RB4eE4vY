// 代码生成时间: 2025-10-02 02:19:14
const { app, BrowserWindow } = require('electron');
const path = require('path');

/**
 * 创建主窗口
 * @returns {BrowserWindow}
 */
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  // 载入index.html
  mainWindow.loadFile('index.html');

  // 打开开发者工具
  mainWindow.webContents.openDevTools();

  return mainWindow;
}

// 当Electron完成初始化并准备好创建浏览器窗口时，调用此函数
app.whenReady().then(createWindow).catch(console.error);

// 所有窗口关闭时退出应用
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

// 预加载脚本，用于暴露原生 Node.js 功能到渲染器进程
// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // 优化算法函数
  optimize: async () => {
    try {
      // 此处实现具体的优化算法
      // 例如，一个简单的冒泡排序算法
      const array = [5, 2, 8, 3, 1, 6, 4];
      for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
          if (array[j] > array[j + 1]) {
            const temp = array[j];
            array[j] = array[j + 1];
            array[j + 1] = temp;
          }
        }
      }
      // 排序完成后，通过IPC返回结果
      ipcRenderer.send('optimized-array', array);
    } catch (error) {
      console.error('Optimization error:', error);
      // 错误处理，反馈给渲染器进程
      ipcRenderer.send('optimization-error', error.message);
    }
  },
});

// index.html
/*
<!DOCTYPE html>
<html>
<head>
  <title>Optimization Algorithm</title>
</head>
<body>
  <h1>Optimization Algorithm in Electron</h1>
  <button id="optimizeButton">Optimize</button>
  <script>
    document.getElementById('optimizeButton').addEventListener('click', () => {
      // 发送消息到主进程，请求执行优化算法
      window.electronAPI.optimize();
    });
    
    window.addEventListener('message', (event) => {
      if (event.data.type === 'optimized-array') {
        console.log('Optimized Array:', event.data.array);
      } else if (event.data.type === 'optimization-error') {
        console.error('Optimization Error:', event.data.error);
      }
    });
  </script>
</body>
</html>
*/
