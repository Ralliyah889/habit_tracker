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

## 📚 **Viva Questions & Interview Prep**

Here are some questions you might be asked about this project:

### **React (Frontend)**

**Q1: Why did you use `Context API` (AuthContext/ThemeContext) instead of Redux?**
> **Answer:** For this scale of application, Redux would be boilerplate-heavy. `Context API` is built into React and is perfect for managing global state that doesn't change extremely frequently, like User Authentication status and Theme (Light/Dark) preferences. It simplifies passing data without "prop drilling".

**Q2: How does the Light/Dark mode implementation work?**
> **Answer:** I used a combination of `CSS Variables` and `React Context`.
> 1.  **CSS:** I defined variables like `--bg-primary` for colors.
> 2.  **Context:** The `ThemeContext` toggles a `data-theme='light'` attribute on the root HTML element.
> 3.  **CSS Selectors:** When that attribute is present, the CSS variables automatically swap their values (e.g., black background becomes white), causing the whole app to update instantly without complex re-renders.

**Q3: How do you handle "Protected Routes"?**
> **Answer:** I created a wrapper component (`ProtectedRoute`). It checks if a `user` exists in the `AuthContext`. If yes, it renders the child component (the page); if no, it immediately redirects functionality to the `/login` page using `Navigate`.

### **Node.js & Backend**

**Q4: What is the role of Middleware in your backend?**
> **Answer:** Middleware functions sit between the request and the response.
> - **Auth Middleware:** Verifies the JWT (JSON Web Token) sent by the frontend to ensure the user is logged in before allowing access to private routes (like creating a habit).
> - **Error Middleware:** Catches any crashes or issues and sends a clean error message back to the frontend instead of hanging the server.

**Q5: Why did you choose MongoDB over a SQL database like MySQL?**
> **Answer:** MongoDB is a NoSQL document database.
> - **Flexibility:** It allows flexible coding; if I want to add a "streak" field to a Habit later, I don't need to run a complex migration like in SQL.
> - **JSON-like:** Data is stored in BSON (Binary JSON), which maps directly to the JavaScript objects used in Node.js and React, making the "MERN" stack very cohesive.

### **Project Logic**

**Q6: How is the "Streak" calculated?**
> **Answer:** It's logic on the backend. We check the completion history. If the habit was completed "yesterday" (relative to the last log), we increment the counter. If a day is missed, the current streak resets to zero, but we keep a "Longest Streak" record for motivation.

**Q7: How are you ensuring user security?**
> **Answer:**
> 1.  **Passwords:** I hash passwords using `bcrypt` before saving them. I never save plain text passwords.
> 2.  **Tokens:** I use standardized `JWT` (JSON Web Tokens) for session management, so the backend is stateless and scalable.

**Q8: What is the Event Loop in Node.js?**
> **Answer:** Node.js is single-threaded. The Event Loop allows it to handle thousands of concurrent connections without blocking. It offloads heavy I/O tasks (like reading from the database) to the system kernel and keeps processing other requests while waiting for the data to return.

---

**Built with ❤️ for the MERN Stack Project**
