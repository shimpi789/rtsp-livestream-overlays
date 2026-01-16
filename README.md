# RTSP Livestream Overlay Demo

This project is a full-stack application that allows users to play an RTSP/HLS livestream and add **persistent text and image overlays** on top of the video. Overlays can be dragged, resized, deleted, and are saved in the database so they persist even after page refresh.

---

## ✨ Features

- RTSP / HLS livestream playback
- Text overlay support (e.g., LIVE badge)
- Image / logo overlay support
- Drag & resize overlays directly on video
- Persistent overlays using MongoDB
- Clean UI with controls outside the video
- Backend REST APIs for overlay CRUD operations

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- HLS.js
- react-rnd

### Backend
- Flask
- Flask-CORS
- Flask-PyMongo

### Database
- MongoDB Atlas

---

## 📂 Project Structure

rtsp-livestream-overlays/
│
├── frontend/
│ ├── src/
│ │ ├── App.jsx
│ │ ├── api.js
│ │ └── main.jsx
│ ├── index.html
│ └── package.json
│
├── backend/
│ ├── app.py
│ ├── requirements.txt
│ └── venv/
│
└── README.md


---

# ⚙️ Setup Instructions

## 1️⃣ Backend Setup (Flask)

### Step 1: Go to backend folder
```bash
cd backend
```
Step 2: Create virtual environment
```bash
python3 -m venv venv
source venv/bin/activate
```

Step 3: Install dependencies
```bash
python3 -m pip install -r requirements.txt
```


If requirements.txt not present:
```bash
python3 -m pip install flask flask-cors flask-pymongo
```

Step 4: Configure MongoDB

Update MONGO_URI in app.py:
```bash
app.config["MONGO_URI"] = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/overlayDB"
```
Step 5: Run backend server
```bash
python3 app.py
```


Backend runs on:
```bash
http://localhost:5000
```

2️⃣ Frontend Setup (React)
Step 1: Go to frontend folder
```bash
cd frontend
```

Step 2: Install dependencies
```bash
npm install
```

Step 3: Run frontend
```bash
npm run dev
```


Frontend runs on:

http://localhost:5173

▶️ Running the Application Locally

Start backend on port 5000

Start frontend on port 5173

Open browser and visit:

http://localhost:5173


Enter RTSP / HLS URL

Play livestream

Add overlays and interact

🔗 Providing or Changing RTSP URL
Note: Browsers do not support RTSP streams directly. RTSP streams must be converted to HLS before playback in the browser.

In the UI:

Locate the RTSP URL input box

Paste a valid RTSP / HLS stream URL

Example test stream:

https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8


Press play — stream will reload

RTSP URL can be changed anytime without restarting the app.

---

📡 API Documentation (CRUD)

Base URL:

http://localhost:5000


🔹 GET All Overlays
Endpoint
GET /overlays
Response
[
  {
    "_id": "64ab12...",
    "type": "text",
    "content": "LIVE",
    "x": 20,
    "y": 20,
    "width": 120,
    "height": 40
  }
]

🔹 CREATE Overlay
Endpoint
POST /overlays
Request Body
{
  "type": "text",
  "content": "LIVE",
  "x": 20,
  "y": 20,
  "width": 120,
  "height": 40
}
Response
{
  "_id": "64ab12...",
  "type": "text",
  "content": "LIVE",
  "x": 20,
  "y": 20,
  "width": 120,
  "height": 40
}

🔹 UPDATE Overlay
Endpoint
PATCH /overlays/:id
Request Body
{
  "x": 100,
  "y": 60,
  "width": 150,
  "height": 50
}

🔹 DELETE Overlay
Endpoint
DELETE /overlays/:id
Response
{
  "message": "Overlay deleted successfully"
}

---

👩‍💻 User Guide
🎥 Livestream Playback
Enter RTSP / HLS URL
Press play
Video plays inside the main video container

📝 Text Overlay
Click Add Text Overlay
Overlay appears on video
Drag to reposition
Resize from any corner
Click ❌ to delete

🖼️ Image / Logo Overlay
Click Add Image Overlay
Image appears on video
Drag and resize like text overlay
Position is saved automatically

💾 Persistence
Overlay position & size saved in MongoDB
Refresh page → overlays reappear in same place


👩‍💻 Author

Shimpi Rajawat
Computer Science Engineering Student
Full-Stack Web Developer



