# 🎬 Video Streaming Application

A **video streaming platform** that allows users to upload videos and stream them efficiently using **HLS (HTTP Live Streaming)**.  
The application processes uploaded videos on the backend and delivers adaptive streaming playback through a responsive frontend player.

This project demonstrates **media processing, scalable streaming architecture, and modern frontend integration**.

---

# 🚀 Features

- Video upload functionality
- Video processing using **FFmpeg**
- HLS (HTTP Live Streaming) video conversion
- Adaptive streaming for better playback performance
- Responsive video player interface
- Scalable media storage and processing

---

# 🏗 Architecture Overview
User
│
▼
Frontend (React + Video.js)
│
▼
Backend API (Node.js + Express)
│
▼
File Upload (Multer)
│
▼
Video Processing (FFmpeg)
│
▼
HLS Video Segments (.m3u8 + .ts)
│
▼
Streaming Playback


---

# 🛠 Tech Stack

## Backend
- **Node.js** – JavaScript runtime
- **Express.js** – Backend framework
- **Multer** – File upload handling
- **FFmpeg** – Video processing and HLS conversion
- **UUID** – Unique file identification
- **CORS** – Cross-origin request handling
- **Chalk** – Terminal logging utilities

## Frontend
- **React** – Frontend library
- **Vite** – Fast development build tool
- **Video.js** – Video player for streaming playback

## Development Tools
- **ESLint** – Code linting
- **Vite Plugin React** – React integration with Vite

---

# 📂 Project Structure
