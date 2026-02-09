# 📋 Pre-Publishing Checklist

Use this checklist before publishing your package to npm.

## Required Updates

- [ ] **Update `package.json`**
  - [ ] Change `"author": "Your Name <your.email@example.com>"` to your actual name and email
  - [ ] Update repository URL: `"url": "https://github.com/yourusername/broadcast-server.git"`
  - [ ] Update bugs URL: `"url": "https://github.com/yourusername/broadcast-server/issues"`
  - [ ] Update homepage: `"homepage": "https://github.com/yourusername/broadcast-server#readme"`
  - [ ] Verify package name is available on npm (or change it)

- [ ] **Update `LICENSE`**
  - [ ] Replace `[Your Name]` with your actual name

- [ ] **Update `README.md`**
  - [ ] Update repository URLs (if you have a GitHub repo)
  - [ ] Update deployed server URL (currently `https://broadcastserver.onrender.com`)

## Testing

- [x] ✅ Package is linked globally (`npm link`)
- [ ] Test `broadcast-server start` command
- [ ] Test `broadcast-server connect ws://localhost:8080` command
- [ ] Test `broadcast-server connect wss://broadcastserver.onrender.com` command
- [ ] Verify web interface works at `http://localhost:8080`
- [ ] Test with `npm pack --dry-run` to see what will be published

## npm Account Setup

- [ ] Create npm account at https://www.npmjs.com/signup
- [ ] Verify email address
- [ ] (Recommended) Enable two-factor authentication
- [ ] Login locally: `npm login`

## Package Name

- [ ] Check if `broadcast-server-cli` is available on npm
  - Run: `npm search broadcast-server-cli`
  - Or check: https://www.npmjs.com/package/broadcast-server-cli
- [ ] If taken, choose alternative name:
  - Option 1: Different name (e.g., `broadcast-ws-cli`, `realtime-broadcast-server`)
  - Option 2: Scoped package (e.g., `@yourusername/broadcast-server-cli`)
  - Update `name` field in `package.json` if needed

## Final Checks

- [ ] All dependencies are listed in `package.json`
- [ ] `cli/cli.js` has proper shebang: `#!/usr/bin/env node` ✅
- [ ] README is clear and helpful
- [ ] LICENSE file exists ✅
- [ ] `.npmignore` excludes unnecessary files ✅
- [ ] Version number is correct (start with 1.0.0) ✅

## Publishing

- [ ] Run `npm publish --dry-run` to preview
- [ ] Run `npm publish` (or `npm publish --access public` for scoped packages)
- [ ] Verify package on npmjs.com
- [ ] Test installation: `npm install -g broadcast-server-cli`

## Post-Publishing

- [ ] Test the published package in a fresh environment
- [ ] Share the package with others
- [ ] Update documentation if needed
- [ ] Tag the release in git: `git tag v1.0.0 && git push --tags`

## Quick Commands Reference

```bash
# Check what will be published
npm pack --dry-run

# Publish (public package)
npm publish

# Publish (scoped package)
npm publish --access public

# Test installation
npm install -g broadcast-server-cli

# Unlink local version first if testing published version
npm unlink -g broadcast-server-cli
```

---

**Ready to publish?** See `PUBLISHING.md` for detailed step-by-step instructions!
