const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const path = require("path");
const PORT = 8081;
const app = express();
app.use(cors());
const { exec } = require("child_process");
const { stderr, stdout } = require("process");
const fs = require("fs");
const { default: chalk } = require("chalk");

//Test route to check if server is running
app.get("/", (req, res) => {
  res.json({
    message: "Its Working",
  });
});

//Static file serving for uploads
app.use("/uploads", express.static("uploads"));

//Multer Middleware for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    // Generate a unique filename using uuid
    cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname));
  },
});

// Initialize multer with the storage configuration
const uploadFile = multer({ storage: storage });

app.post("/upload", uploadFile.single("file"), async (req, res) => {

  //if no file uploade 
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const lessonId = uuidv4();
    const videoPath = req.file.path;
    const outputPath = path.join("uploads", "courses", lessonId);

    // Create output folder
    if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });

    // FFmpeg path
    const ffmpegPath = "C:\\ffmpeg\\ffmpeg\\bin\\ffmpeg.exe";

    // Define renditions
    const renditions = [
      { name: "240p", width: 426, height: 240, bitrate: "400k" },
      { name: "360p", width: 640, height: 360, bitrate: "800k" },
      { name: "720p", width: 1280, height: 720, bitrate: "2500k" },
    ];

    // Build FFmpeg commands for each rendition
    const commands = renditions.map(r => {
      const folder = path.join(outputPath, r.name);
      if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
      return `"${ffmpegPath}" -i "${videoPath}" -vf scale=${r.width}:${r.height} -c:v libx264 -b:v ${r.bitrate} -c:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${folder}/segment%03d.ts" "${folder}/index.m3u8"`;
    });

    // Execute all commands sequentially
    for (const cmd of commands) {
      await new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
          if (error) return reject(stderr);
          console.log(stdout, stderr);
          resolve();
        });
      });
    }

    // Create master playlist
    let masterPlaylist = "#EXTM3U\n#EXT-X-VERSION:3\n";
    renditions.forEach(r => {
      masterPlaylist += `#EXT-X-STREAM-INF:BANDWIDTH=${parseInt(r.bitrate) * 1000},RESOLUTION=${r.width}x${r.height}\n`;
      masterPlaylist += `${r.name}/index.m3u8\n`;
    });
    fs.writeFileSync(path.join(outputPath, "master.m3u8"), masterPlaylist);

    // Response URL
    const videoUrl = `http://localhost:${PORT}/uploads/courses/${lessonId}/master.m3u8`;

    res.json({
      message: "Video converted to multi-bitrate HLS",
      videoUrl,
      lessonId,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Video conversion failed", details: err.toString() });
  }
});

app.listen(PORT, () => {
  console.log(chalk.greenBright(`Server is running on port ${PORT}`));
});
