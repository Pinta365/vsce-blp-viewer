import * as vscode from "vscode";
import { BlpEditorProvider } from "./BlpEditorProvider";

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(BlpEditorProvider.register(context));
}

export function deactivate() {}
