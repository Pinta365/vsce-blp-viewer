# BLP Image Preview

Preview Blizzard `.blp` texture files directly in VS Code — no external tools required.

<p align="center">
  <img src="https://cdn.pinta.land/vsce/vsce-blp-viewer1.png" alt="BLP Preview">
  <img src="https://cdn.pinta.land/vsce/vsce-blp-viewer2.png" alt="BLP Preview Metadata">
</p>

## Features

- Opens `.blp` files as image previews automatically
- Displays image metadata: format, alpha depth, mipmap count, and file size
- Supports all BLP2 compression formats:
  - **DXT1** — no alpha or 1-bit alpha
  - **DXT3** — explicit 4-bit alpha
  - **DXT5** — interpolated 8-bit alpha
  - **RAW1** — palettized (256-color)
  - **RAW3** — uncompressed ARGB8888
- Respects VS Code's light/dark theme for the preview background

## Usage

Open any `.blp` file in VS Code. The preview renders automatically in place of the text editor.

## Supported File Types

| Extension | Format |
|-----------|--------|
| `.blp` | Blizzard Picture (BLP2) |

## Requirements

No external tools or runtimes required. Decoding is handled entirely within the extension using the [@pinta365/blp](https://jsr.io/@pinta365/blp) library.

## Known Limitations

- Only the main mipmap level (level 0) is displayed
- BLP1 files (Warcraft III pre-TBC era) are not supported

## License

MIT
