// 代码生成时间: 2025-10-10 02:08:26
const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

// 创建一个流媒体播放器窗口的函数
function createWindow() {
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
  });

  // 并加载应用的 index.html 文件
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  // 打开开发者工具
  win.webContents.openDevTools();

  // 添加事件监听器
  win.on('closed', () => {
    win = null;
  });
}

// 当 Electron 完成初始化并准备好创建浏览器窗口时调用此函数
app.on('ready', createWindow);

// 所有窗口关闭时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 激活应用并创建新窗口时重新创建窗口
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 用于播放流媒体的简单 HTML 文件
// 在 index.html 文件中，我们将使用 video 标签来播放媒体
// 同时使用 JavaScript 控制播放

// 以下是 index.html 文件的示例内容
/*
<!DOCTYPE html>
<html>
<head>
  <title>流媒体播放器</title>
</head>
<body>
  <video id="mediaPlayer" width="640" height="360" controls>
    <source src="流媒体地址" type="video/mp4">
    您的浏览器不支持 video 标签。
  </video>
  <script>
    // 获取视频元素
    const videoElement = document.getElementById('mediaPlayer');

    // 检测视频加载错误
    videoElement.addEventListener('error', (event) => {
      console.error('视频加载失败', event);
      alert('视频加载失败，请检查地址是否正确。');
    });

    // 检测视频播放完毕
    videoElement.addEventListener('ended', () => {
      console.log('视频播放完毕');
    });

    // 其他事件和控制逻辑可以在这里添加
  </script>
</body>
</html>
*/

// 注意：
// 1. 确保你有流媒体文件的地址，并替换 '流媒体地址'
// 2. 确保流媒体文件格式被浏览器支持，这里示例使用了 mp4
// 3. 根据需要添加更多的功能和错误处理