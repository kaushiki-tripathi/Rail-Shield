<!-- ===================== HEADER BANNER ===================== -->
<div align="center">
  <h1>🚨 RailShield</h1>
  <h3>A Smart Railway Emergency Response System</h3>

  <!-- Typing SVG tagline -->
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=28&pause=1000&color=FF5733&center=true&vCenter=true&width=700&lines=Report+Emergencies+Instantly;Track+Live+Geolocation;Manage+Reports+Effortlessly;Travel+With+Peace+of+Mind" alt="Typing SVG" />
  </a>

  <p>
    <a href="https://github.com/kaushiki-tripathi/RailShield-Project"><img src="https://img.shields.io/badge/GitHub-RailShield-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repo"></a>
    <a href="https://your-live-demo-link.com"><img src="https://img.shields.io/badge/Live-Demo-4CAF50?style=for-the-badge&logo=appveyor&logoColor=white" alt="Live Demo"></a>
  </p>
</div>

---

### 🚄 About The Project
**RailShield** is a full-stack web application providing a **real-time railway emergency reporting system**. Users can report emergencies, track live location, and admins can monitor & manage reports on a dashboard.  

<p align="center">
  <img src="demo.gif" alt="RailShield Demo" width="600" />
</p>

---

### ✨ Key Features
- ⚡ **End-to-End Emergency Reporting** – Reports saved in live database  
- 🌍 **Live Geolocation Tracking** – Interactive maps with GPS coordinates  
- 📊 **Admin Dashboard** – View and update report status instantly  
- 🖥️ **Responsive UI** – Modern design with React & Tailwind  
- 🔄 **Smooth Routing** – SPA experience using `react-router-dom`  

---

### 🛠️ Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
</p>

---

### ✅ Project Progress

| Feature                          | Status | Notes |
| -------------------------------- | :----: | ----- |
| Backend API                       | ✅     | CRUD API ready |
| Frontend UI                       | ✅     | React/Tailwind |
| End-to-End Reporting              | ✅     | Works live |
| Admin Dashboard                   | ✅     | Fully functional |
| Passenger Auth (OTP)              | ⏳     | Next step |
| Admin Auth                        | ⏳     | Frontend connection pending |
| Twilio SMS Integration            | ⏳     | Planned for future |

### 👥 Team Members

- **Anand Kumar** - Full-Stack Developer | Project Lead 
- **Kaushiki Tripathi** – Full-Stack Developer 
- **Prateek Verma** – Frontend Developer  

> Currently, the team is actively working on **OTP-based authentication for passengers & admins** and **Twilio SMS integration**.

---
<details>
  <summary>🚀 How to Run Locally</summary>
  <br>

### Prerequisites
- Node.js v18+ & npm
- MongoDB (local or Atlas)

### Backend
```bash
cd backend
npm install
# add .env: MONGO_URI, JWT_SECRET, PORT=5000
npm run dev
