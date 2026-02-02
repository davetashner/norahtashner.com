#!/bin/bash
#
# normalize-audio.sh - Normalize podcast episode volumes to consistent loudness
#
# Uses ffmpeg's loudnorm filter (EBU R128 standard) for broadcast-quality
# loudness normalization. This ensures all episodes play at the same volume.
#
# Requirements:
#   - ffmpeg (install via: brew install ffmpeg)
#
# Usage:
#   ./tools/normalize-audio.sh <input-dir> <output-dir>
#   ./tools/normalize-audio.sh <input-file> <output-file>
#
# Options:
#   -t, --target    Target loudness in LUFS (default: -16, podcast standard)
#   -p, --true-peak Maximum true peak in dBTP (default: -1.5)
#   -c, --center    Center audio (mono mix to both channels) - good for voice
#   -a, --analyze   Analyze only, don't normalize
#   -v, --verbose   Show detailed ffmpeg output
#   -h, --help      Show this help message
#
# Examples:
#   ./tools/normalize-audio.sh ./raw-episodes ./normalized-episodes
#   ./tools/normalize-audio.sh -t -14 ./episodes ./output
#   ./tools/normalize-audio.sh --center ./episodes ./centered  # center the audio
#   ./tools/normalize-audio.sh --analyze ./episodes

set -e

# Default values (podcast standard levels)
TARGET_LUFS=-16
TRUE_PEAK=-1.5
CENTER_AUDIO=false
ANALYZE_ONLY=false
VERBOSE=false

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

usage() {
    head -28 "$0" | tail -25 | sed 's/^# //' | sed 's/^#//'
    exit 0
}

log() {
    echo -e "${BLUE}[normalize]${NC} $1"
}

success() {
    echo -e "${GREEN}[normalize]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[normalize]${NC} $1"
}

error() {
    echo -e "${RED}[normalize]${NC} $1" >&2
}

# Check for ffmpeg
check_dependencies() {
    if ! command -v ffmpeg &> /dev/null; then
        error "ffmpeg is required but not installed."
        echo ""
        echo "Install with:"
        echo "  macOS:  brew install ffmpeg"
        echo "  Ubuntu: sudo apt install ffmpeg"
        exit 1
    fi
}

# Analyze a single file and return loudness stats
analyze_file() {
    local input="$1"
    local filename=$(basename "$input")

    log "Analyzing: $filename"

    # Run first pass to get loudness measurements
    local stats=$(ffmpeg -i "$input" -af "loudnorm=print_format=json" -f null - 2>&1 | \
        grep -A 12 '"input_i"' | head -13)

    if [ -z "$stats" ]; then
        error "Failed to analyze $filename"
        return 1
    fi

    # Extract values
    local input_i=$(echo "$stats" | grep '"input_i"' | grep -o '[-0-9.]*')
    local input_tp=$(echo "$stats" | grep '"input_tp"' | grep -o '[-0-9.]*')
    local input_lra=$(echo "$stats" | grep '"input_lra"' | grep -o '[-0-9.]*')
    local input_thresh=$(echo "$stats" | grep '"input_thresh"' | grep -o '[-0-9.]*')

    echo ""
    echo "  File: $filename"
    echo "  Integrated Loudness: ${input_i} LUFS"
    echo "  True Peak: ${input_tp} dBTP"
    echo "  Loudness Range: ${input_lra} LU"
    echo ""

    # Return the stats for use in normalization
    echo "$input_i|$input_tp|$input_lra|$input_thresh"
}

# Normalize a single file using two-pass loudnorm
normalize_file() {
    local input="$1"
    local output="$2"
    local filename=$(basename "$input")

    log "Processing: $filename"

    # First pass: analyze
    local first_pass=$(ffmpeg -i "$input" -af "loudnorm=I=${TARGET_LUFS}:TP=${TRUE_PEAK}:LRA=11:print_format=json" -f null - 2>&1)

    # Extract measured values for second pass (parse JSON output)
    local measured_i=$(echo "$first_pass" | grep '"input_i"' | grep -o '[-0-9.]*' | head -1)
    local measured_tp=$(echo "$first_pass" | grep '"input_tp"' | grep -o '[-0-9.]*' | head -1)
    local measured_lra=$(echo "$first_pass" | grep '"input_lra"' | grep -o '[-0-9.]*' | head -1)
    local measured_thresh=$(echo "$first_pass" | grep '"input_thresh"' | grep -o '[-0-9.]*' | head -1)
    local offset=$(echo "$first_pass" | grep '"target_offset"' | grep -o '[-0-9.]*' | head -1)

    if [ -z "$measured_i" ]; then
        error "Failed to get loudness measurements for $filename"
        return 1
    fi

    # Second pass: normalize with measured values
    local ffmpeg_opts="-y"
    if [ "$VERBOSE" = false ]; then
        ffmpeg_opts="$ffmpeg_opts -loglevel warning"
    fi

    # Build filter chain
    local loudnorm_filter="loudnorm=I=${TARGET_LUFS}:TP=${TRUE_PEAK}:LRA=11:measured_I=${measured_i}:measured_TP=${measured_tp}:measured_LRA=${measured_lra}:measured_thresh=${measured_thresh}:offset=${offset}:linear=true"

    local audio_filter="$loudnorm_filter"
    if [ "$CENTER_AUDIO" = true ]; then
        # Mix stereo to mono (centered) then output as stereo
        # pan filter: both output channels get 50% of each input channel
        audio_filter="pan=stereo|c0=0.5*c0+0.5*c1|c1=0.5*c0+0.5*c1,${loudnorm_filter}"
    fi

    ffmpeg $ffmpeg_opts -i "$input" -af "$audio_filter" -ar 44100 -ab 192k "$output"

    success "Created: $(basename "$output")"
    echo "  Original loudness: ${measured_i} LUFS"
    echo "  Target loudness:   ${TARGET_LUFS} LUFS"
    if [ "$CENTER_AUDIO" = true ]; then
        echo "  Audio: Centered (mono mix)"
    fi
    echo ""
}

# Process a directory of audio files
process_directory() {
    local input_dir="$1"
    local output_dir="$2"

    if [ "$ANALYZE_ONLY" = false ]; then
        mkdir -p "$output_dir"
    fi

    local count=0
    local processed=0

    # Find all audio files
    shopt -s nullglob
    local files=("$input_dir"/*.mp3 "$input_dir"/*.m4a "$input_dir"/*.wav "$input_dir"/*.flac "$input_dir"/*.aac "$input_dir"/*.ogg)
    shopt -u nullglob

    for input in "${files[@]}"; do
        [ -f "$input" ] || continue
        count=$((count + 1))

        local filename=$(basename "$input")
        local output="$output_dir/$filename"

        if [ "$ANALYZE_ONLY" = true ]; then
            analyze_file "$input"
        else
            normalize_file "$input" "$output"
        fi

        processed=$((processed + 1))
    done

    if [ $count -eq 0 ]; then
        warn "No audio files found in $input_dir"
        echo "Supported formats: mp3, m4a, wav, flac, aac, ogg"
        exit 1
    fi

    echo ""
    if [ "$ANALYZE_ONLY" = true ]; then
        success "Analyzed $processed files"
    else
        success "Normalized $processed files to $TARGET_LUFS LUFS"
        echo "Output directory: $output_dir"
    fi
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--target)
            TARGET_LUFS="$2"
            shift 2
            ;;
        -p|--true-peak)
            TRUE_PEAK="$2"
            shift 2
            ;;
        -c|--center)
            CENTER_AUDIO=true
            shift
            ;;
        -a|--analyze)
            ANALYZE_ONLY=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -h|--help)
            usage
            ;;
        *)
            break
            ;;
    esac
done

# Check arguments
if [ $# -lt 1 ]; then
    error "Missing input path"
    echo "Usage: $0 [options] <input> [output]"
    echo "Run '$0 --help' for more information"
    exit 1
fi

INPUT="$1"
OUTPUT="${2:-}"

# Main
check_dependencies

echo ""
echo "========================================"
echo "  Podcast Audio Normalizer (EBU R128)"
echo "========================================"
echo "  Target: ${TARGET_LUFS} LUFS"
echo "  True Peak: ${TRUE_PEAK} dBTP"
if [ "$CENTER_AUDIO" = true ]; then
echo "  Center: Yes (mono mix to stereo)"
fi
echo "========================================"
echo ""

if [ -d "$INPUT" ]; then
    # Directory mode
    if [ -z "$OUTPUT" ] && [ "$ANALYZE_ONLY" = false ]; then
        error "Output directory required when processing a directory"
        echo "Usage: $0 <input-dir> <output-dir>"
        exit 1
    fi
    process_directory "$INPUT" "$OUTPUT"
elif [ -f "$INPUT" ]; then
    # Single file mode
    if [ -z "$OUTPUT" ] && [ "$ANALYZE_ONLY" = false ]; then
        # Default output: add "-normalized" before extension
        ext="${INPUT##*.}"
        base="${INPUT%.*}"
        OUTPUT="${base}-normalized.${ext}"
    fi

    if [ "$ANALYZE_ONLY" = true ]; then
        analyze_file "$INPUT"
    else
        normalize_file "$INPUT" "$OUTPUT"
    fi
else
    error "Input not found: $INPUT"
    exit 1
fi
