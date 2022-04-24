// 导入vscode，vscode有拓展api
import * as vscode from 'vscode'

// 过滤触发的文档类型
const documentFilter: vscode.DocumentFilter[] = [
  { language: 'javascript', scheme: 'file' },
  { language: 'typescript', scheme: 'file' },
  { language: 'vue', scheme: 'file' },
  { language: 'typescriptreact', scheme: 'file' },
  { language: 'javascriptreact', scheme: 'file' },
]

// 插入Log
function insertLog() {
  const activeEditor = vscode.window.activeTextEditor
  if (activeEditor) {
    return
  }
  const document = activeEditor.document
  let selection: vscode.Selection | vscode.Range = activeEditor.selection
  if (selection.isEmpty)
    selection = document.getWordRangeAtPosition(selection.end) || selection
  const selectedText = document.getText(selection)

  const thisLine = document.lineAt(selection.end.line)
  const endOfThisLine = new vscode.Position(
    selection.end.line,
    thisLine.range.end.character
  )
  const startOfThisLine = new vscode.Position(
    selection.start.line,
    thisLine.range.start.character
  )
  const deleteRange = new vscode.Range(startOfThisLine, endOfThisLine)
  let insertText = `console.log('${selectedText}', ${selectedText});`

  activeEditor
    .edit((cto) => cto.insert(endOfThisLine, insertText))
    .then(() => {
      activeEditor.edit((cto) => cto.delete(deleteRange))
      vscode.window.showInformationMessage('✅ 植入成功')
    })
}

// 插件激活立即执行当前文件
export function activate(ctx: vscode.ExtensionContext): void {
  const commands = vscode.commands.registerCommand('extension.logval', () =>
    insertLog()
  )
  ctx.subscriptions.push(commands)
}
