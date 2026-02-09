# Quick Start - Testing Before Publishing

Follow these steps to test your npm package locally before publishing to npm.

## 1. Install Dependencies

```bash
npm install
```

## 2. Test the Package Locally with npm link

This creates a symlink to your package globally, allowing you to test it as if it were installed from npm:

```bash
npm link
```

## 3. Test the CLI Commands

Now you can use the `broadcast-server` command from anywhere:

### Start the server:
```bash
broadcast-server start
```

The server should start on port 8080. Open your browser to `http://localhost:8080` to see the web interface.

### Connect via CLI (in a new terminal):
```bash
broadcast-server connect ws://localhost:8080
```

Type messages and press Enter to send them. Type `/exit` to quit.

## 4. Verify Package Contents

Check what files will be included in your npm package:

```bash
npm pack --dry-run
```

This shows you exactly what will be published without actually creating the package.

## 5. Create a Test Package

Create an actual tarball to inspect:

```bash
npm pack
```

This creates a `.tgz` file (e.g., `broadcast-server-cli-1.0.0.tgz`). You can:
- Extract it to see the contents: `tar -xzf broadcast-server-cli-1.0.0.tgz`
- Install it in another directory to test: `npm install -g ./broadcast-server-cli-1.0.0.tgz`

## 6. Unlink When Done Testing

Remove the global symlink:

```bash
npm unlink -g broadcast-server-cli
```

## 7. Ready to Publish!

If everything works correctly, you're ready to publish! See `PUBLISHING.md` for detailed publishing instructions.

## Troubleshooting

### EEXIST error - File already exists
If you get an error like `EEXIST: file already exists` when running `npm link`:

```bash
# First, unlink the existing package
npm unlink -g broadcast-server-cli

# Then link again with --force
npm link --force
```

This happens when you've previously linked the package and need to update it.

### Command not found after npm link
- Make sure npm's global bin directory is in your PATH
- On Windows, you may need to restart your terminal
- Check npm's global bin location: `npm bin -g`

### Permission errors
- On macOS/Linux, you may need to use `sudo npm link`
- Or configure npm to use a different directory: [npm docs](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)

### Changes not reflected
- Unlink and link again: `npm unlink -g broadcast-server-cli && npm link --force`
- Or just restart your terminal
