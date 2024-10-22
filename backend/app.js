const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
// const WebSocketServer = require("ws");
const ws = require("ws");

// const cookieParser = require("cookie-parser");

const HttpError = require("../backend/models/http-error");

const forumsRoutes = require("./routes/forums-routes");
const commentsRoutes = require("./routes/comments-routes");
const messagesRoutes = require("./routes/messages-routes");
const usersRoutes = require("./routes/users-routes");
const queryRoutes = require("./routes/chatbot-routes");
const uploadRoutes = require("./routes/loader-routes");
const appointmentRoutes = require("./routes/appointments-routes");

require('dotenv').config();

const app = express();

const cors = require('cors');
const jwt = require("jsonwebtoken");
app.use(cors());

// Parse req body, extract json/convert to JS before using route
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.get("/api/verify", (req, res) => {
  const token = req.header('Authorization'); // Bearer TOKEN

  if (!token) {
    return res.status(401).json({message: 'No token, authorization denied'});
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    res.json({message: 'Token is valid', user});
  });
});

app.use("/api/users", usersRoutes);
app.use("/api/forums", forumsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/chat", queryRoutes);
app.use("/api/files", uploadRoutes);
app.use("/api/appointments", appointmentRoutes);

// Handle Unsupported Route error
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route. ", 404);
  throw error; // call Default Error Handler
});

// Default Error Handler - applied to every incoming request
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({message: error.message || "An unknown error occurred!"});
});

// Connect to Database
mongoose
  .connect(
    "mongodb+srv://cs178:fries@fries.d7odjp0.mongodb.net/MedShare?retryWrites=true&w=majority" // Connect to database with connection string
  )
  .then(() => {
    app.listen(process.env.PORT || 5001); // If connection to DB succeeds, start backend server
  })
  .catch((err) => {
    console.log(err);
  });
