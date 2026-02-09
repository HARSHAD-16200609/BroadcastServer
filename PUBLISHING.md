# Publishing to npm

This guide will help you publish the broadcast-server-cli package to npm.

## Prerequisites

1. **npm Account**: Create an account at [npmjs.com](https://www.npmjs.com/signup)
2. **npm CLI**: Make sure npm is installed (comes with Node.js)

## Step-by-Step Publishing Guide

### 1. Login to npm

```bash
npm login
```

Enter your npm username, password, and email when prompted.

### 2. Update Package Information

Before publishing, update the following in `package.json`:

- **author**: Replace `"Your Name <your.email@example.com>"` with your actual name and email
- **repository**: Update the GitHub repository URL if you have one
- **name**: The package name `broadcast-server-cli` should be unique on npm. Check availability:

```bash
npm search broadcast-server-cli
```

If the name is taken, choose a different one (e.g., `@yourusername/broadcast-server-cli` for a scoped package).

### 3. Test Your Package Locally

Before publishing, test that your package works:

```bash
# Install dependencies
npm install

# Test the CLI locally
npm link

# Now you can test the command
broadcast-server start
# Press Ctrl+C to stop

# Test connect command (in another terminal)
broadcast-server connect ws://localhost:8080

# Unlink when done testing
npm unlink -g broadcast-server-cli
```

### 4. Version Your Package

Follow semantic versioning (MAJOR.MINOR.PATCH):

```bash
# For first release, version is already 1.0.0
# For future updates:
npm version patch  # Bug fixes (1.0.0 -> 1.0.1)
npm version minor  # New features (1.0.0 -> 1.1.0)
npm version major  # Breaking changes (1.0.0 -> 2.0.0)
```

### 5. Publish to npm

```bash
# Dry run to see what will be published
npm publish --dry-run

# Actually publish
npm publish
```

**For scoped packages** (e.g., `@yourusername/broadcast-server-cli`):
```bash
npm publish --access public
```

### 6. Verify Publication

After publishing, verify your package:

```bash
# Search for your package
npm search broadcast-server-cli

# View package info
npm view broadcast-server-cli

# Install and test
npm install -g broadcast-server-cli
broadcast-server start
```

## Updating Your Package

When you make changes and want to publish an update:

1. Make your code changes
2. Update the version: `npm version patch` (or `minor`/`major`)
3. Publish: `npm publish`

## Unpublishing (Use with Caution)

You can unpublish within 72 hours of publishing:

```bash
npm unpublish broadcast-server-cli@1.0.0  # Specific version
npm unpublish broadcast-server-cli --force  # Entire package (not recommended)
```

**Note**: Unpublishing is discouraged and may be blocked for popular packages.

## Common Issues

### "Package name already exists"
- Choose a different name or use a scoped package: `@yourusername/broadcast-server-cli`
- Update the `name` field in `package.json`

### "You must be logged in"
- Run `npm login` and enter your credentials

### "You do not have permission to publish"
- Make sure you're logged in with the correct account
- For scoped packages, use `npm publish --access public`

### "Version already published"
- Increment the version number in `package.json`
- Or use `npm version patch/minor/major`

## Best Practices

1. **Test before publishing**: Always test your package locally with `npm link`
2. **Use semantic versioning**: Follow semver for version numbers
3. **Write good documentation**: Keep README.md up to date
4. **Add a .npmignore**: Exclude unnecessary files (already created)
5. **Tag releases**: Use git tags for versions: `git tag v1.0.0 && git push --tags`

## Package Maintenance

### Checking Package Stats
```bash
npm view broadcast-server-cli
```

### Viewing Download Stats
Visit: `https://www.npmjs.com/package/broadcast-server-cli`

### Deprecating a Version
```bash
npm deprecate broadcast-server-cli@1.0.0 "This version has a critical bug"
```

## Security

- **Never commit sensitive data**: Use `.npmignore` to exclude sensitive files
- **Enable 2FA**: Enable two-factor authentication on your npm account
- **Use npm audit**: Regularly check for vulnerabilities: `npm audit`

## Resources

- [npm Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [npm Package Best Practices](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
