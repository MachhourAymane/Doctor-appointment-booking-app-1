const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors"); // Import cors package
const connectDB = require("./config/connectDB"); // Import the connection function

// Initialize MongoDB connection
connectDB();

app.use(cors()); // Enable CORS for all routes (default allows all origins)

// Other middlewares and routes
app.use(express.json());

const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const doctorRoute = require("./routes/doctorsRoute");
const path = require("path");

app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/doctor", doctorRoute);

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client/build/index.html"));
  });
}

const port = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Server started on port ${port}!`));
