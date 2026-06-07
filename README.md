# Gameplay Programmer Portfolio Website

A premium, modern, responsive developer portfolio website designed for gameplay systems programmer **Ayomide V. Awoyemi**.

## Features

- **Sleek, Modern Aesthetics**: Clean grid cards, glow effects, professional typography, and layout.
- **Light & Dark Mode**: Integrated theme toggling that automatically respects system preference (`prefers-color-scheme`) and persists choice via `localStorage`.
- **Project Filter System**: Interactive client-side category sorting for FPS, Fighter, Action RPG, Motion Capture, and other categories.
- **Redesigned Skills Section**: Modern skills display with detail analyzers.
- **Direct Contact Portals**: Direct buttons for WhatsApp, Discord, LinkedIn, Twitter, and Email, alongside a functional quest transmission form.
- **Timeline Quest Log**: RPG Quest Log-themed professional experience tracking.
- **Automated Deployment**: GitHub Actions workflow included for instant hosting.

## How to Publish to GitHub Pages

To host this website on GitHub for free using GitHub Pages, follow these simple steps:

### Step 1: Create a Repository on GitHub
1. Log in to [GitHub](https://github.com).
2. Click the **New** button (or go to `https://github.com/new`).
3. Set the Repository Name (e.g., `gameplay-programmer-portfolio`).
4. Keep the repository **Public** (required for free GitHub Pages hosting).
5. **Do not** initialize the repository with a README, `.gitignore`, or License (since they already exist locally).
6. Click **Create repository**.

### Step 2: Link and Push Local Code
Open your terminal (PowerShell, CMD, or Git Bash) inside your project directory (`C:\Users\User\.gemini\antigravity\scratch\gameplay-programmer-portfolio`), and run:

```bash
# Add all files to staging
git add .

# Commit changes
git commit -m "Complete website redesign with light/dark mode and assets"

# Add the remote link (replace USERNAME and REPO-NAME with yours)
git remote add origin https://github.com/USERNAME/REPO-NAME.git

# Set the default branch name to master
git branch -M master

# Push code to GitHub
git push -u origin master
```

### Step 3: Enable GitHub Pages via Actions
1. On your GitHub repository page, navigate to **Settings** (top tabs).
2. On the left sidebar, click **Pages** (under the "Code and automation" section).
3. Under **Build and deployment**, find **Source**.
4. Change the dropdown from **Deploy from a branch** to **GitHub Actions**.
5. Once selected, GitHub will automatically run the workflow file found in `.github/workflows/deploy.yml` on every future push, and your site will be live within seconds!
6. The URL of your published website will be displayed at the top of the Pages settings page once the deployment completes.
