// 代码生成时间: 2025-10-04 17:45:43
const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const { parse } = require('node-html-parser');

// 测试报告生成器主函数
function createTestReport() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    // 加载测试报告模板
    win.loadFile('test-report-template.html');

    win.webContents.on('did-finish-load', () => {
        dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }).then((result) => {
            if (result.canceled || !result.filePaths.length) return;

            // 读取测试结果文件
            const filePath = result.filePaths[0];
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    dialog.showErrorBox('Error', 'Failed to read test results file.');
                    return;
                }

                try {
                    const root = parse(data);
                    const testResults = root.querySelectorAll('.test-result');
                    const reportData = testResults.map(node => ({
                        name: node.querySelector('.test-name').innerText,
                        status: node.querySelector('.test-status').innerText,
                        description: node.querySelector('.test-description').innerText,
                    }));

                    // 将测试结果数据传递给渲染器进程
                    win.webContents.send('test-results', reportData);
                } catch (error) {
                    dialog.showErrorBox('Error', 'Failed to parse test results file.');
                }
            });
        });
    });
}

app.whenReady().then(createTestReport);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});