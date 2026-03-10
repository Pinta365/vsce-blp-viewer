import * as vscode from "vscode";
import * as fs from "fs";

export class BlpEditorProvider implements vscode.CustomReadonlyEditorProvider {

    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        return vscode.window.registerCustomEditorProvider(
            "blpviewer.preview",
            new BlpEditorProvider(context),
            {
                webviewOptions: { retainContextWhenHidden: true },
                supportsMultipleEditorsPerDocument: false,
            }
        );
    }

    constructor(private readonly context: vscode.ExtensionContext) {}

    openCustomDocument(uri: vscode.Uri): vscode.CustomDocument {
        return { uri, dispose: () => {} };
    }

    async resolveCustomEditor(
        document: vscode.CustomDocument,
        webviewPanel: vscode.WebviewPanel
    ): Promise<void> {
        webviewPanel.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this.context.extensionUri, "media"),
            ],
        };

        webviewPanel.webview.html = this.getHtml(webviewPanel.webview);

        try {
            const raw = await fs.promises.readFile(document.uri.fsPath);
            const { decodeBlpData } = await import("@pinta365/blp");
            const decoded = decodeBlpData(new Uint8Array(raw));

            webviewPanel.webview.postMessage({
                type: "image",
                width: decoded.width,
                height: decoded.height,
                pixels: Array.from(decoded.pixels),
            });
        } catch (err) {
            webviewPanel.webview.postMessage({
                type: "error",
                message: String(err),
            });
        }
    }

    private getHtml(webview: vscode.Webview): string {
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this.context.extensionUri, "media", "preview.js")
        );

        return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src ${webview.cspSource}; style-src 'unsafe-inline';">
    <title>BLP Preview</title>
    <style>
        body {
            margin: 0;
            padding: 16px;
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            font-family: var(--vscode-font-family);
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        #status {
            margin-bottom: 12px;
            font-size: 13px;
            opacity: 0.7;
        }
        canvas {
            max-width: 100%;
            image-rendering: pixelated;
            border: 1px solid var(--vscode-panel-border);
        }
        #error {
            color: var(--vscode-errorForeground);
        }
    </style>
</head>
<body>
    <div id="status">Loading…</div>
    <canvas id="canvas" style="display:none;"></canvas>
    <div id="error" style="display:none;"></div>
    <script src="${scriptUri}"></script>
</body>
</html>`;
    }
}
