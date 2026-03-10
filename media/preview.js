const vscode = acquireVsCodeApi();

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const status = document.getElementById("status");
const errorEl = document.getElementById("error");

window.addEventListener("message", (event) => {
    const msg = event.data;

    if (msg.type === "image") {
        const { width, height, pixels } = msg;

        canvas.width = width;
        canvas.height = height;

        const imageData = ctx.createImageData(width, height);
        imageData.data.set(pixels);
        ctx.putImageData(imageData, 0, 0);

        status.textContent = `${width} x ${height}`;
        canvas.style.display = "block";

    } else if (msg.type === "error") {
        status.style.display = "none";
        errorEl.textContent = `Failed to decode BLP: ${msg.message}`;
        errorEl.style.display = "block";
    }
});
