🔹 What is HLS?
HLS (HTTP Live Streaming) is a media streaming protocol developed by Apple. It breaks the video into small chunks of .ts files and delivers them over HTTP. It uses an M3U8 playlist file to index the segments.

🔹 What is Adaptive Bitrate Streaming?
Adaptive Bitrate (ABR) Streaming dynamically adjusts the quality (bitrate and resolution) of a video stream in real-time based on the viewer’s internet speed and device capability.

🔹 How HLS ABR Works
  Multiple Renditions:
    The original video is encoded into multiple bitrates/resolutions (e.g., 240p, 480p, 720p, 1080p).
    Each version is split into short video segments (typically 2 to 10 seconds).
  
  Master Playlist (M3U8):
    A master .m3u8 file lists all the available renditions.
    Each rendition has its own .m3u8 playlist that references its segment files.


 🔹 Player Behavior:
    The video player starts by downloading a low-bitrate stream to ensure quick playback.
    It continuously monitors the buffer level, CPU load, and network speed.
    If conditions improve, it switches to a higher bitrate; if they worsen, it downgrades.


  🔹 Tools for Creating HLS ABR Streams
    FFmpeg (encoding and segmenting)
    AWS MediaConvert / MediaPackage
    Wowza / Nimble Streamer
    Shaka Packager or Bitmovin Encoder
