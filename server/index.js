const express = require("express");
require("dotenv").config();
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); app.use('/public', express.static(path.join(__dirname, 'public')));

const authRoutes = require("./routes/auth.js");
const listingRoutes = require("./routes/listing.js");
const bookingRoutes = require("./routes/booking.js");
const userRoutes = require("./routes/user.js");
const reviewRoutes = require("./routes/review.js");


app.use("/auth", authRoutes);
app.use("/properties", listingRoutes);
app.use("/bookings", bookingRoutes);
app.use("/users", userRoutes);
app.use("/reviews", reviewRoutes);


const mongoose = require("mongoose");
const PORT = 3001;
mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "Home_Rentals",
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((err) => console.log(`${err} did not connect`));



