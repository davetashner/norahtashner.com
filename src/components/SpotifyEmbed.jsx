import './SpotifyEmbed.css'

const SPOTIFY_SHOW_ID = '4VY57mUtnr7fqRtmN2j9Ra'

function SpotifyEmbed({ episodeId = null, compact = false }) {
  // Use episode embed URL if episodeId is provided, otherwise show embed
  const embedUrl = episodeId
    ? `https://open.spotify.com/embed/episode/${episodeId}?utm_source=generator&theme=0`
    : `https://open.spotify.com/embed/show/${SPOTIFY_SHOW_ID}?utm_source=generator&theme=0`

  const height = compact ? 152 : 352

  return (
    <div className={`spotify-embed ${compact ? 'spotify-embed--compact' : ''}`}>
      <iframe
        src={embedUrl}
        width="100%"
        height={height}
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Norah's Notes Podcast on Spotify"
      />
    </div>
  )
}

export default SpotifyEmbed
