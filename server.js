require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Booking = require("./models/Booking");

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose        
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));


//GET: http://localhost:3000/api/bookings - To Get all bookings

app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings", error: err.message });
  }
});

//POST:  http://localhost:3000/api/bookings - Add a new booking
app.post("/api/bookings", async (req, res) => {
  try {
    const { name, email, event, ticketType } = req.body;

    if (!name || !email || !event) {
      return res.status(400).json({ message: "Name, email, and event are required." });
    }

    const booking = new Booking({ name, email, event, ticketType });
    await booking.save();

    res.status(201).json({ message: "Booking created successfully!", booking });
  } catch (err) {
    res.status(500).json({ message: "Error creating booking", error: err.message });
  }
});

//GET http://localhost:3000/api/bookings:id - Get booking by particular ID
// -----------------------------------------
app.get("/api/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (err) {
    res.status(400).json({ message: "Invalid ID format", error: err.message });
  }
});

//PUT: http://localhost:3000/api/bookings:id - Update particular participant details
// -----------------------------------------
app.put("/api/bookings/:id", async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedBooking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking updated successfully", booking: updatedBooking });
  } catch (err) {
    res.status(400).json({ message: "Error updating booking", error: err.message });
  }
});


//DELETE: http://localhost:3000/api/bookings/:id - Delete a particular participanr booking details
app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting booking", error: err.message });
  }
});


//GET: http://localhost:3000/api/bookings/search?email=xyz - Get booking by particular email
app.get("/api/bookings/search", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email query parameter required" });

    const bookings = await Booking.find({ email: { $regex: email, $options: "i" } });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error searching bookings", error: err.message });
  }
});


//GET:  http://localhost:3000/filter?event=Synergia
// -----------------------------------------
app.get("/api/bookings/filter", async (req, res) => {
  try {
    const { event } = req.query;
    if (!event) return res.status(400).json({ message: "Event query parameter required" });

    const bookings = await Booking.find({ event: { $regex: event, $options: "i" } });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error filtering bookings", error: err.message });
  }
});

/*
// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
*/
//or (below one) 
app.listen(3000, () => {
  console.log(`🚀 Server running on http://localhost:3000`);

});
