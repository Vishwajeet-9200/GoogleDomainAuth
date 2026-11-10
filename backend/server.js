const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

const app = express();

app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Authentication Middleware
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized. Token required.",
      });
    }

    const token = authHeader.split("Bearer ")[1];

    const decodedToken = await admin.auth().verifyIdToken(token);

    const email = decodedToken.email;

    if (
      !decodedToken.email_verified ||
      !email ||
      !email.toLowerCase().endsWith("@hbplus.fit")
    ) {
      return res.status(403).json({
        message: "Access is restricted to official HB+ email accounts only.",
      });
    }

    req.user = decodedToken;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

// Home Route
app.get("/", (req, res) => {
  res.send("HB Plus Backend is running!");
});

// Protected Dashboard API
app.get("/api/dashboard", verifyToken, (req, res) => {
  res.json({
    message: "Welcome to HB Plus Dashboard!",
    email: req.user.email,
    name: req.user.name,
  });
});

// Start Server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
