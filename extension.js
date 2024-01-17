const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Congratulations, your extension "ai-task-generator" is now active!');

    let disposable = vscode.commands.registerCommand('ask-ai-task-generator', async function () {
        // Define the tasks
        const tasks = {
            'Variables': fs.readFileSync(path.join(__dirname, 'python_tasks', 'variables', 'int.py'), 'utf8'),
            'Strings': fs.readFileSync(path.join(__dirname, 'python_tasks', 'strings', 'string.py'), 'utf8')
        };

        // Ask the user to choose a task
        const chosenTask = await vscode.window.showQuickPick(Object.keys(tasks), { placeHolder: 'Choose a task' });
        if (!chosenTask) {
            vscode.window.showInformationMessage('No task selected!');
            return;
        }

        // Write the chosen task to a new Python file
        const taskFile = vscode.Uri.file(path.join(__dirname, 'example.py'));
        const taskFileEdit = new vscode.WorkspaceEdit();
        taskFileEdit.createFile(taskFile, { ignoreIfExists: true });
        taskFileEdit.insert(taskFile, new vscode.Position(0, 0), tasks[chosenTask]);
        await vscode.workspace.applyEdit(taskFileEdit);

        vscode.window.showInformationMessage('Task Generated!');
    });

    // Register a command for cleaning up when the extension is deactivated
    let cleanupDisposable = vscode.commands.registerCommand('cleanup-ai-task-generator', function () {
        const taskFilePath = path.join(__dirname, 'example.py');
        try {
            fs.unlinkSync(taskFilePath);
            vscode.window.showInformationMessage('Task file deleted!');
        } catch (error) {
            vscode.window.showErrorMessage(`Error deleting task file: ${error.message}`);
        }
    });

    context.subscriptions.push(disposable, cleanupDisposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
