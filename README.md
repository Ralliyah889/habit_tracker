# 🎯 HabitFlow - Complete MERN Stack Application

A modern, full-stack Habit Tracker application built with the MERN stack (MongoDB, Express, React, Node.js). 
Featuring authentication, habit tracking, streaks, detailed progress logging, gamification elements, and a beautiful light/dark mode UI.

---

## 🚀 **QUICK START**

### **1. Backend Setup**
```bash
cd backend
npm install
npm run dev
# Server runs on: http://localhost:5001
```

### **2. Frontend Setup**
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
# App runs on: http://localhost:3000
```

### **3. View the App**
Open your browser to: **http://localhost:3000**

---

## ✨ **Key Features**

### **Core Functionality**
- **User Authentication**: Secure Login & Register with JWT and bcrypt password hashing.
- **Habit Management**: Create, Read, Update, and Delete habits.
- **Progress Tracking**: Mark habits as complete/incomplete for any date.
- **Streaks**: Automatic streak calculation to keep you motivated.
- **Responsive Design**: Works perfectly on desktop and mobile.

### **UI & Experience**
- **Light/Dark Mode**: Toggle between themes using the Sun/Moon icon. Preferences are saved.
- **Modern Dashboard**: Clean interface with glassmorphism effects and smooth animations.
- **Empty States**: Helpful prompts when no data is available.

### **🎮 Games & Gamification**
- **XP System**: Earn XP for completing habits. Level up every 100 XP.
- **Badges**: Unlock badges for milestones (e.g., "Week Warrior" for 7-day streak).
- **Games Hub**: Dedicated `/games` route with interactive motivators.
- **Focus Timer**: A Pomodoro-style timer with distraction detection to keep you focused.

---

## 🔧 **Tech Stack**

**Frontend:**
- React 18 (Vite)
- React Router DOM 6
- Context API (for Auth & Theme management)
- CSS Variables (for dynamic theming)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JWT (JSON Web Tokens) for security
- Bcrypt.js for hashing

---

## 🐛 **Troubleshooting**

### **Backend Port Conflict (Address already in use)**
If you see an error about port 5000 being in use:
1. The project has been configured to use **Port 5001** to avoid conflicts.
2. Ensure your frontend accesses `http://localhost:5001`.
3. To kill stuck processes:
   ```bash
   killall node
   ```

### **MongoDB Connection Failed**
1. Make sure MongoDB is running (`mongod` in terminal).
2. Check your `.env` file in the `backend` folder. It should look like:
   ```env
   MONGO_URI=mongodb://localhost:27017/habit-tracker
   PORT=5001
   JWT_SECRET=your_super_secret_key
   ```

### **"Register" Button Doesn't Work**
- Ensure both Backend (port 5001) and Frontend (port 3000) are running.
- Check the console for errors. If it says "Network Error", the backend might be down.

---

**Built with ❤️ for the MERN Stack Project**
