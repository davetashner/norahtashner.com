# Transfer instructions

This `comet-catcher/` folder is a scaffold for a **separate** GitHub repo at
`github.com/davetashner/comet-catcher`. It's checked into this site repo only
on the `scaffold/comet-catcher` branch as a way to ship the initial files
across the boundary. Do NOT merge this branch into `main` of the site repo.

## On your laptop, after `git fetch origin scaffold/comet-catcher`

```bash
# Pick a parent dir for your projects
cd ~/projects   # or wherever

# Pull the scaffold subfolder out of the site repo branch
git -C path/to/norahtashner.com archive scaffold/comet-catcher comet-catcher \
  | tar -x

# That gives you ./comet-catcher/ as a fresh tree
cd comet-catcher

# Init the new repo and point it at the empty GitHub repo you created
git init -b claude/comet-catcher-game-Kwf4m
git remote add origin git@github.com:davetashner/comet-catcher.git
git add -A
git commit -m "Initial scaffold: Phaser 3 + Vite, Level 1 prototype"
git push -u origin claude/comet-catcher-game-Kwf4m
```

(If you prefer HTTPS over SSH, swap the remote URL.)

## After the comet-catcher repo is bootstrapped

Two cleanup steps:

1. **Add repo secrets** at github.com/davetashner/comet-catcher → Settings →
   Secrets and variables → Actions:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `CLOUDFRONT_DISTRIBUTION_ID`

2. **Delete this transfer branch** so it doesn't linger:
   ```bash
   git push origin --delete scaffold/comet-catcher
   ```

3. The site repo's `claude/comet-catcher-game-Kwf4m` branch has a separate
   commit updating `.github/workflows/deploy.yml` to preserve
   `games/comet-catcher/*` across site deploys. **Merge that to `main`
   before** merging anything to `main` on the comet-catcher repo, or the
   next site deploy will wipe the game's S3 path.

## Run the game locally

```bash
npm install
npm run dev
```

Vite prints a `Network: http://192.168.x.x:5174/` URL — open on your phone
(same WiFi), portrait orientation.
