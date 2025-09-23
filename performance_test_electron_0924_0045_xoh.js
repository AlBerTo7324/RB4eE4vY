// 代码生成时间: 2025-09-24 00:45:41
const { app, BrowserWindow } = require('electron');
const { performance } = require('perf_hooks');

// 定义性能测试函数
function runPerformanceTest() {
  // 定义测试代码块
  const start = performance.now();
  // 这里添加要测试的代码
  // 示例：计算数组中元素的总和
  const array = new Array(100000).fill(1);
  const sum = array.reduce((a, b) => a + b, 0);
  const end = performance.now();
  
  // 计算并输出执行时间
  console.log(`性能测试耗时: ${end - start} 毫秒`);
  
  // 检查结果是否符合预期
  if (sum !== 100000) {
    throw new Error('性能测试失败: 结果不正确');
  }
}

// 创建和加载Electron窗口
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  
  win.loadFile('index.html');
  
  win.on('closed', () => {
    win = null;
  });
}

// 当Electron完成初始化后并准备好创建浏览器窗口时，调用createWindow
app.whenReady().then(createWindow);

// 所有窗口关闭时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 激活应用并创建窗口
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 运行性能测试
runPerformanceTest();