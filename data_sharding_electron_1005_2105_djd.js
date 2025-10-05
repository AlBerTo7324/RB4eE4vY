// 代码生成时间: 2025-10-05 21:05:55
const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

// 配置常量
const MAX_FILE_SIZE = 1024 * 1024 * 10; // 最大文件大小，10MB
const DATA_DIRECTORY = path.join(app.getPath('desktop'), 'DataSharding'); // 数据存放目录

// 创建窗口和加载界面
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

// 初始化Electron应用
app.on('ready', createWindow);

// 监听Electron应用关闭事件
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

// IPC通信 - 分片上传文件
ipcMain.handle('shard-upload', async (event, ...args) => {
  try {
    // 处理分片上传逻辑
    const file = args[0];
    const shardSize = args[1];
    const totalShards = args[2];
    const shardIndex = args[3];

    // 确保数据目录存在
    fs.mkdirSync(DATA_DIRECTORY, { recursive: true });

    // 计算分片路径
    const shardPath = path.join(DATA_DIRECTORY, `${file.name}-shard-${shardIndex}.bin`);

    // 读取文件分片并写入到分片文件
    const reader = fs.createReadStream(file.path, {
      start: shardIndex * shardSize,
      end: (shardIndex + 1) * shardSize - 1,
    });

    const writer = fs.createWriteStream(shardPath);

    reader.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        resolve(shardPath);
      });
      writer.on('error', reject);
    });
  } catch (error) {
    throw error;
  }
});

// IPC通信 - 合并分片文件
ipcMain.handle('merge-shards', async (event, ...args) => {
  try {
    // 处理文件合并逻辑
    const fileName = args[0];
    const shardFiles = args[1];

    // 确保数据目录存在
    fs.mkdirSync(DATA_DIRECTORY, { recursive: true });

    // 计算完整文件路径
    const filePath = path.join(DATA_DIRECTORY, fileName);

    // 创建可写流
    const writer = fs.createWriteStream(filePath);

    // 合并分片文件
    for (const shardFile of shardFiles) {
      const reader = fs.createReadStream(shardFile);
      reader.pipe(writer, { end: false });
    }

    // 关闭流
    writer.end();

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        resolve(filePath);
      });
      writer.on('error', reject);
    });
  } catch (error) {
    throw error;
  }
});

// 注释说明：
// 该程序实现了基于Electron框架的文件分片上传和合并功能。
// - `shard-upload` IPC处理函数负责将大文件分割成多个小分片，并保存到指定目录。
// - `merge-shards` IPC处理函数负责将分片文件合并回一个完整的文件。
// - 程序中包含了错误处理和必要的注释，以确保代码的可维护性和可扩展性。