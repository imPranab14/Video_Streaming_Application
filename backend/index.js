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

app.post("/upload", uploadFile.single("file"), (req, res) => {
  // const uploadFile=req.file
  //console.log("uploadFile",uploadFile);

  const lessonId = uuidv4();
  const videoPath = req.file.path;
  const outputPath = `./uploads/courses/${lessonId}`;
  const hlsPath = `${outputPath}/index.m3u8`;
  console.log("hlsPath", hlsPath);

  //if PATH does not exist, create it
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  // ffmpeg command to convert video to HLS format
  //const ffmpegCommand = `ffmpeg -i "${videoPath}" -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;
  const ffmpegPath = "C:\\ffmpeg\\ffmpeg\\bin\\ffmpeg.exe";
  const ffmpegCommand = `"${ffmpegPath}" -i "${videoPath}" -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 "${hlsPath}"`;
  console.log("ffmpegCommand", ffmpegCommand);
  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.log(`exec error: ${error}`);
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    const videoUrl = `http://localhost:${PORT}/uploads/courses/${lessonId}/index.m3u8`;

    res.json({
      message: "Video converted to HLS format",
      videoUrl: videoUrl,
      lessonId: lessonId,
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
