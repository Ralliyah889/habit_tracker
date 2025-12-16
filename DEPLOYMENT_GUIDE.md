# 🚀 MERN Stack Deployment Guide

Follow these steps to deploy your Habit Tracker application for free!

---

## **Phase 1: Database (MongoDB Atlas)**

If you are currently using a local MongoDB, you need a cloud database.

1.  **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up/login.
2.  **Create Cluster**: Click **+ Create**, select **M0 Sandbox** (Free Tier), and click **Create Deployment**.
3.  **Setup User**:
    *   Go to **Database Access** -> **+ Add New Database User**.
    *   Username: `admin` (or your choice).
    *   Password: **Create a strong password** and **SAVE IT**.
    *   Click **Add User**.
4.  **Network Access**:
    *   Go to **Network Access** -> **+ Add IP Address**.
    *   Select **Allow Access From Anywhere (0.0.0.0/0)**.
    *   Click **Confirm**.
5.  **Get Connection String**:
    *   Go to **Database** -> **Connect** -> **Drivers**.
    *   Copy the string (e.g., `mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`).
    *   **Replace `<password>`** with your actual password. **Keep this string safe!**

### **❓ FAQ: Can I use MongoDB Compass?**

**No, you cannot "deploy" with Compass.**
*   **Compass** is just a viewing tool (like a browser).
*   **Local MongoDB** lives on your laptop. Render (the cloud) cannot connect to your laptop.
*   **MongoDB Atlas** is the cloud database that Render CAN connect to.

**✅ But you CAN connect Compass to Atlas!**
1.  Open MongoDB Compass on your laptop.
2.  Paste your **Atlas Connection String** (from step 5 above).
3.  Click **Connect**.
4.  Now you can view/edit your **live production data** from your laptop! 🚀

---

## **Phase 2: Backend (Render)**

We will use [Render](https://render.com/) to host the Node.js API.

1.  **Push to GitHub**: Ensure your project is pushed to a GitHub repository.
2.  **Create Web Service**:
    *   Log in to Render with GitHub.
    *   Click **New +** -> **Web Service**.
    *   Connect your repository.
3.  **Configure Service**:
    *   **Name**: `habit-tracker-api` (or similar).
    *   **Root Directory**: `backend` (IMPORTANT!).
    *   **Environment**: `Node`.
    *   **Build Command**: `npm install`.
    *   **Start Command**: `npm start`.
4.  **Environment Variables**:
    *   Scroll down to **Environment Variables**.
    *   Add `MONGO_URI`: Paste your MongoDB connection string from Phase 1.
    *   Add `JWT_SECRET`: Enter a secret random string (e.g., `mySuperSecretKey123`).
    *   *(Optional)* `PORT`: Render sets this automatically, but you can set it to `5001`.
5.  **Deploy**: Click **Create Web Service**.
    *   Wait for the build to finish.
    *   Copy your **Backend URL** (e.g., `https://habit-tracker-api.onrender.com`).

---

## **Phase 3: Frontend (Render)**

You can deploy your React app as a **Static Site** on Render.

1.  **Create Static Site**:
    *   On your Render Dashboard, click **New +** -> **Static Site**.
    *   Connect your repository.
2.  **Configure Service**:
    *   **Name**: `habit-tracker-ui` (or similar).
    *   **Root Directory**: `frontend` (IMPORTANT!).
    *   **Build Command**: `npm run build`.
    *   **Publish Directory**: `dist`.
3.  **Environment Variables**:
    *   Scroll down to **Environment Variables**.
    *   Add `VITE_API_URL`: Paste your **Backend URL** from Phase 2 + `/api` (e.g., `https://habit-tracker-api.onrender.com/api`).
    *   *Note: Ensure to include `/api`!*
4.  **Handling Page Refreshes (Rewrites)**:
    *   Go to the **Redirects/Rewrites** tab (after creating, or during creation if possible).
    *   Add a new rule:
        *   **Source**: `/*`
        *   **Destination**: `/index.html`
        *   **Action**: `Rewrite`
    *   *This ensures that refreshing pages like /login doesn't give a 404 error.*
5.  **Deploy**: Click **Create Static Site**.
    *   Wait for the build.
    *   Visit your new URL!


---

## **Phase 4: Verification**

1.  Open your new Vercel URL.
2.  Try to **Register** a new user.
3.  If it works, you have successfully deployed your Full Stack MERN App! 🚀

---

### ** Troubleshooting**

*   **CORS Error?**
    *   The backend currently allows all origins (`cors()`). If you customized this, make sure to add your Vercel domain to the allowed list in `server.js`.
*   **"Network Error" on Register?**
    *   Check if your `VITE_API_URL` in Vercel is correct (did you miss `/api`?).
    *   Check Render logs to see if the backend crashed (often due to bad `MONGO_URI`).
