# 🌄 Piper's Great Adventure 🦄

Welcome to the magical world of **Piper the Unicorn** and her forest friends!  
This is a React-powered storybook site with rich background scenes, character assets, and page-by-page storytelling.

Live site: [https://piperstory.com](https://piperstory.com) *(replace with actual domain)*

---

## 📦 Project Structure

`src/`
```
├── App.jsx                   # Home page
├── main.jsx                  # React Router setup
└── pages/                    # Story scene components
├── Campsite.jsx
├── MountainForest.jsx
├── LakeEdge.jsx
└── CampsiteNight.jsx
```

`public/`
```
└── assets/img/               # Backgrounds, characters, props
├──── campsite.png
├──── mountain-forest-path.png
├──── lake-edge.png
├──── campsite-night.png
├──── unicorn-piper-eyes-open.png
├──── bunny-thumper.png
├──── deer-spotty.png
├──── turtle-tortuga.png
├──── campfire.png
└──── …etc
```

---

## 🚀 Development

### 🛠️ Prerequisites

- Node.js (v20+)
- NPM or Yarn
- AWS account with S3 + CloudFront configured
- GitHub repository

### 🧪 Local Dev

```bash
npm install
npm run dev
```

Visit: <http://localhost:5173>

### 🌐 Deployment via GitHub Actions

This site is deployed to Amazon S3 with automatic CloudFront cache invalidation.

### 🔐 Required GitHub Secrets

Go to your GitHub repository → Settings → Secrets → Actions and add:

|Secret Name.                | Description.                        |
|----------------------------|-------------------------------------|
| AWS_ACCESS_KEY_ID          | IAM user with deploy permissions    |
| A------------------------Y | I---------------------------------y |
| AWS_S3_BUCKET              | S3 bucket name (e.g. piperstory.com |
| CLOUDFRONT_DISTRIBUTION_ID | CloudFront Distribution ID          |

### 📁 Workflow: .github/workflows/deploy.yml

```yml
name: Deploy Storybook Site

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🔧 Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: 📦 Install dependencies
        run: npm install

      - name: 🏗️ Build site
        run: npm run build

      - name: 🚀 Sync to S3
        uses: jakejarvis/s3-sync-action@master
        with:
          args: --delete
        env:
          AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: "us-east-1"
          SOURCE_DIR: "dist"

      - name: 🌐 Invalidate CloudFront
        uses: chetan/invalidate-cloudfront-action@v2
        env:
          DISTRIBUTION: ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }}
          PATHS: "/*"
          AWS_REGION: "us-east-1"
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## ✨ Story Pages

 • / — Landing page
 • /campsite — Morning at the lake
 • /mountain-forest — Forest hiking adventure
 • /lake-edge — Sunset and return to camp
 • /campsite-night — Campfire celebration

🖼️ Assets

All characters, props, and backgrounds live in:

```
public/assets/img/
```

Use descriptive filenames:
 • unicorn-piper-eyes-open.png
 • turtle-tortuga.png
 • campfire.png
 • shooting-star-lamp.png
 • mountain-forest-path.png
 • etc.

## 👩‍💻 Authors

Created by Dave and Norah Tashner
Story: Piper’s Great Adventure!
Art generated and rendered with magical help. 🦄✨
