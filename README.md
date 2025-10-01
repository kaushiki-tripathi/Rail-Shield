<div align="center">
  <br />
  <p>
    <a href="https://github.com/your-username/RailShield-Project"></a>
  </p>
  <h1 align="center"><b>RailShield: A Smart Railway Emergency Response System</b></h1>
  <p align="center">
    Your trusted partner in railway safety. Report emergencies, get real-time alerts, and travel with peace of mind.
    <br />
    <br />
  </p>
</div>

---

### 🚄 About The Project

**RailShield** is a full-stack web application designed to provide a reliable, real-time emergency reporting system for railway passengers in India. This project is currently in the active development phase, with the core online prototype being fully functional. Our goal is to bridge the communication gap between passengers in distress and railway authorities, ensuring timely assistance.

---

### ✨ Key Features

* **End-to-End Emergency Reporting:** Submit a detailed emergency report that is instantly saved to our live database.
* **Live Geolocation:** Fetch and display a user's precise GPS coordinates and address on an interactive map.
* **Live Admin Dashboard:** A functional "control room" for admins to view and manage a live feed of all incoming emergency reports.
* **Interactive Report Management:** Admins can update the status of any report from "Pending" to "Acknowledged" or "Resolved".
* **Modern, Responsive UI:** A beautiful and consistent user interface built with React and Tailwind CSS.
* **Multi-Page Routing:** A smooth, single-page application experience using `react-router-dom`.

---

### 🛠️ Technology Stack

<p align="center">
  <a href="https://react.dev/" target="_blank"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"></a>
  <a href="https://vitejs.dev/" target="_blank"><img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"></a>
  <a href="https://tailwindcss.com/" target="_blank"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
  <a href="https://nodejs.org/" target="_blank"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"></a>
  <a href="https://expressjs.com/" target="_blank"><img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"></a>
  <a href="https://www.mongodb.com/" target="_blank"><img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"></a>
</p>

---

### ✅ Project Progress Checklist

| Feature                          | Status | Description                                                                 |
| -------------------------------- | :----: | --------------------------------------------------------------------------- |
| **Backend API** |   ✅   | Node.js/Express server with full CRUD API for reports.                      |
| **Frontend UI** |   ✅   | All pages designed with React/Tailwind, including interactive forms & maps. |
| **End-to-End Reporting** |   ✅   | A user can submit a report, and it appears on the admin dashboard live.     |
| **Interactive Admin Dashboard** |   ✅   | Admins can view details and update the status of any report.                |
| **Passenger Authentication** |   ⏳   | OTP generation is complete. OTP verification is the next step.              |
| **Admin Authentication** |   ⏳   | Backend setup is ready. Needs frontend connection.                          |
| **Twilio SMS Integration** |   ⏳   | Planned for a future step to enable offline reporting.                      |

---

<details>
  <summary>🚀 **How to Run This Project Locally**</summary>
  <br>
  
  To set up and run this project on your local machine, follow these steps.

  ### Prerequisites

  * Node.js (v18 or later) & npm
  * A MongoDB database (local or via Atlas)

  ### 1. Backend Setup
  ```bash
  # Navigate to the backend directory
  cd backend

  # Install dependencies
  npm install

  # Create a .env file and add your MongoDB and JWT secrets
  # MONGO_URI=your_mongodb_connection_string
  # JWT_SECRET=your_secret
  # PORT=5000

  # Start the backend server
  npm run dev
