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

### 0. Intro/Outro Template

Every episode uses the same layout: intro music alone from 0:00 to 0:30, Norah
starts talking at **0:30**, and the intro music fades out over **5 s starting at
0:40**. The outro music fades in over 3 s, starting 1 s before it begins.

### 1. Normalize the Audio

```bash
./tools/normalize-audio.sh --center "path/to/episode.mp3" "output.mp3"
```

This normalizes to -16 LUFS and centers the audio (mono mix for voice).

### 2. Upload to S3

```bash
aws s3 cp output.mp3 s3://norahtashner.com/podcast/episodes/S01E07.mp3 \
  --content-type "audio/mpeg" \
  --cache-control "public, max-age=31536000"
```

**Never overwrite an existing episode's file.** Audio is cached for a year and
podcast apps only re-download when the enclosure URL changes. To replace an
episode's audio, upload it under a new name (e.g. `S01E03-v2.mp3`) and update
`audioUrl`, `duration`, `durationSeconds` and `fileSizeBytes`. The GUID stays
`/episode/<number>`, so apps treat it as the same episode.

### 3. Add Episode Metadata

Add a new entry to `episodes/episodes.json`:

```json
{
  "episodeNumber": 7,
  "season": 1,
  "title": "Episode Title Here",
  "description": "Episode description here.",
  "publishDate": "2026-10-03",
  "duration": "12:34",
  "durationSeconds": 754,
  "audioUrl": "https://norahtashner.com/podcast/episodes/S01E07.mp3",
  "fileSizeBytes": 18000000,
  "explicit": false
}
```

`fileSizeBytes` is the exact MP3 size (`stat -f %z output.mp3`); it becomes the
RSS enclosure `length`, which Apple Podcasts checks.

### 4. Commit and Push

```bash
git add episodes/episodes.json
git commit -m "Add S01E07: Episode Title"
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
