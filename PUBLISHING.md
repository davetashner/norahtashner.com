# Publishing New Episodes

## Quick Start (Automated)

1. **Drop audio file in inbox:**
   ```bash
   cp ~/path/to/new-episode.mp3 episodes/inbox/
   ```

2. **Commit:**
   ```bash
   git add . && git commit -m "new episode"
   ```

3. **Edit metadata:** The pre-commit hook creates `episodes/episode-N.json`. Edit it with the real title and description.

4. **Push:**
   ```bash
   git push
   ```

The CI pipeline will deploy the site and RSS feed automatically.

---

## Manual Process

If the pre-commit hook isn't working, here's the manual process:

### 1. Normalize the Audio

```bash
./tools/normalize-audio.sh --center "path/to/episode.mp3" "output.mp3"
```

This normalizes to -16 LUFS and centers the audio (mono mix for voice).

### 2. Upload to S3

```bash
aws s3 cp output.mp3 s3://norahtashner.com/podcast/episodes/S01E06.mp3 \
  --content-type "audio/mpeg" \
  --cache-control "public, max-age=31536000"
```

### 3. Add Episode Metadata

Add a new entry to `episodes/episodes.json`:

```json
{
  "episodeNumber": 6,
  "season": 1,
  "title": "Episode Title Here",
  "description": "Episode description here.",
  "publishDate": "2026-02-15",
  "duration": "12:34",
  "durationSeconds": 754,
  "audioUrl": "https://norahtashner.com/podcast/episodes/S01E06.mp3",
  "explicit": false
}
```

### 4. Commit and Push

```bash
git add episodes/episodes.json
git commit -m "Add S01E06: Episode Title"
git push
```

---

## Environment Setup

Add to `~/.zshrc`:

```bash
export PODCAST_S3_BUCKET=norahtashner.com
export PODCAST_S3_PREFIX=podcast/episodes
export PODCAST_CLOUDFRONT_URL=https://norahtashner.com
```

### Required Tools

- **ffmpeg:** `brew install ffmpeg`
- **jq:** `brew install jq`
- **AWS CLI:** `brew install awscli` (configure with `aws configure`)

---

## RSS Feed

The RSS feed is generated automatically during build:

```bash
npm run build:rss
```

Feed URL: `https://norahtashner.com/feed.xml`

---

## File Locations

| File | Purpose |
|------|---------|
| `episodes/episodes.json` | Episode metadata (source of truth) |
| `episodes/inbox/` | Drop new audio files here |
| `tools/normalize-audio.sh` | Audio normalization script |
| `tools/generate-rss.js` | RSS feed generator |
| `tools/hooks/pre-commit` | Git hook for automated publishing |
