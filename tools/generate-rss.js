#!/usr/bin/env node
/**
 * RSS Feed Generator for Norah's Notes Podcast
 *
 * Generates a valid podcast RSS feed (RSS 2.0 with iTunes/Spotify extensions)
 * from the episodes.json metadata file.
 *
 * Usage:
 *   node tools/generate-rss.js > dist/feed.xml
 *   npm run build:rss
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

// Read episodes data
const episodesPath = join(ROOT_DIR, 'episodes', 'episodes.json');
if (!existsSync(episodesPath)) {
  console.error('Error: episodes/episodes.json not found');
  process.exit(1);
}

const data = JSON.parse(readFileSync(episodesPath, 'utf-8'));
const { podcast, episodes } = data;

// Helper to escape XML
const escapeXml = (str) => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

// Format date for RSS (RFC 822)
const formatRssDate = (dateStr) => {
  const date = new Date(dateStr + 'T12:00:00Z');
  return date.toUTCString();
};

// Generate RSS feed
const generateRss = () => {
  const now = new Date().toUTCString();

  // Sort episodes by date (newest first)
  const sortedEpisodes = [...episodes].sort((a, b) =>
    new Date(b.publishDate) - new Date(a.publishDate)
  );

  const items = sortedEpisodes.map(ep => `
    <item>
      <title>${escapeXml(ep.title)}</title>
      <description><![CDATA[${ep.description}]]></description>
      <pubDate>${formatRssDate(ep.publishDate)}</pubDate>
      <enclosure url="${ep.audioUrl}" length="0" type="audio/mpeg"/>
      <guid isPermaLink="false">${podcast.website}/episode/${ep.episodeNumber}</guid>
      <itunes:duration>${ep.duration}</itunes:duration>
      <itunes:episode>${ep.episodeNumber}</itunes:episode>
      <itunes:season>${ep.season}</itunes:season>
      <itunes:explicit>${ep.explicit ? 'yes' : 'no'}</itunes:explicit>
      <itunes:episodeType>full</itunes:episodeType>
    </item>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(podcast.title)}</title>
    <description><![CDATA[${podcast.description}]]></description>
    <link>${podcast.website}</link>
    <language>${podcast.language}</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${podcast.website}/feed.xml" rel="self" type="application/rss+xml"/>

    <!-- iTunes/Apple Podcasts tags -->
    <itunes:author>${escapeXml(podcast.author)}</itunes:author>
    <itunes:summary><![CDATA[${podcast.description}]]></itunes:summary>
    <itunes:type>episodic</itunes:type>
    <itunes:owner>
      <itunes:name>${escapeXml(podcast.author)}</itunes:name>
      <itunes:email>${podcast.email}</itunes:email>
    </itunes:owner>
    <itunes:explicit>${podcast.explicit ? 'yes' : 'no'}</itunes:explicit>
    <itunes:category text="${escapeXml(podcast.category)}">
      <itunes:category text="${escapeXml(podcast.subcategory)}"/>
    </itunes:category>
    <itunes:image href="${podcast.coverImage}"/>

    <!-- Standard RSS image -->
    <image>
      <url>${podcast.coverImage}</url>
      <title>${escapeXml(podcast.title)}</title>
      <link>${podcast.website}</link>
    </image>

    <!-- Episodes -->
${items}
  </channel>
</rss>`;
};

// Main
const rss = generateRss();

// Output to stdout or file
const outputPath = process.argv[2];
if (outputPath) {
  writeFileSync(outputPath, rss);
  console.error(`RSS feed written to ${outputPath}`);
} else {
  console.log(rss);
}
