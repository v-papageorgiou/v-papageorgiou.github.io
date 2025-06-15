# GitHub Pages Deployment Guide

This guide will help you deploy your academic website to GitHub Pages at `https://v-papageorgiou.github.io/`.

## Quick Deployment Steps

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `v-papageorgiou.github.io` (this will be your GitHub Pages URL)
3. Make it public (required for GitHub Pages)
4. Don't initialize with README since you already have the project

### 2. Push Your Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit: Academic website"

# Add your GitHub repository as origin
git remote add origin https://github.com/v-papageorgiou/v-papageorgiou.github.io.git

# Push to GitHub
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. The workflow will automatically deploy your site

### 4. Automatic Deployment

The included GitHub Actions workflow (`.github/workflows/deploy.yml`) will:
- Automatically build your site when you push to the `main` branch
- Deploy it to GitHub Pages
- Your site will be available at `https://v-papageorgiou.github.io/`

## Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Build the static site
npm run export

# The built site will be in the 'out' folder
# You can upload this folder to any static hosting service
```

## Configuration Details

### Next.js Configuration
- **Static Export**: Configured in `next.config.ts`
- **Image Optimization**: Disabled for static hosting
- **Trailing Slashes**: Enabled for better GitHub Pages compatibility

### GitHub Actions Workflow
- **Trigger**: Runs on push to `main` branch
- **Node.js**: Uses Node 18
- **Cache**: NPM dependencies are cached for faster builds
- **Deploy**: Uses `peaceiris/actions-gh-pages` action

### SEO Configuration
- **URLs**: Updated to use `https://v-papageorgiou.github.io/`
- **Sitemap**: Configured for your domain
- **Robots.txt**: Optimized for search engines
- **Structured Data**: Points to your GitHub Pages URL

## Updating Your Site

To update your website:

1. Make changes to your code
2. Commit and push to GitHub:
```bash
git add .
git commit -m "Update website content"
git push
```
3. GitHub Actions will automatically rebuild and deploy your site

## Custom Domain (Optional)

If you want to use a custom domain like `vpapageorgiou.com`:

1. Add a `CNAME` file to the `public/` folder with your domain
2. Configure DNS settings with your domain provider
3. Update the URLs in the configuration files

## Troubleshooting

### Build Fails
- Check the Actions tab in your GitHub repository for error details
- Ensure all dependencies are properly listed in `package.json`

### Site Not Loading
- Wait 5-10 minutes after first deployment
- Check that GitHub Pages is enabled in repository settings
- Verify the repository name matches your desired URL

### Updates Not Showing
- GitHub Pages can take a few minutes to update
- Check the Actions tab to see if deployment completed
- Try hard refresh (Ctrl+F5 or Cmd+Shift+R)

## Support

If you encounter issues:
1. Check the GitHub Actions logs in your repository
2. Verify all files are committed and pushed
3. Ensure repository settings have Pages enabled

Your website should be live at: `https://v-papageorgiou.github.io/`
