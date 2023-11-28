const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const HttpError = require("../backend/models/http-error");
const forumRoutes = require("./routes/forum-routes");
const messagesRoutes = require("./routes/messages-routes");
const patientsRoutes = require("./routes/patients-routes");
const doctorsRoutes = require("./routes/doctors-routes");

const app = express();

// Parse req body, extract json/convert to JS before using route
app.use(bodyParser.json());

app.use("/api/forum", forumRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/patients", patientsRoutes);
app.use("/api/doctors", doctorsRoutes);

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
  res.json({ message: error.message || "An unknown error occurred!" });
});

// Connect to Database
mongoose
  .connect(
    "mongodb+srv://cs178:fries@fries.d7odjp0.mongodb.net/MedShare?retryWrites=true&w=majority" // Connect to database with connection string
  )
  .then(() => {
    app.listen(5000); // If connection to DB succeeds, start backend server
  })
  .catch((err) => {
    console.log(err);
  });
