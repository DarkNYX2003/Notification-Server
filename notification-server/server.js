const express = require('express');
const app = express();
const notiRoutes = require('./routes/notificationRoutes');
require("dotenv").config();

app.use(express.json());
app.use('/api',notiRoutes);

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const PORT = 5000;
const readQueue = require("./Queue/readNotification");

app.listen(PORT,()=>{console.log( "Server is running on " + PORT) ;
  readQueue().catch(console.error);});