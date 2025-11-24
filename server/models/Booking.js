import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: String, ref: "User", required: true }, 
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  referenceId: { 
        type: String, 
        unique: true, 
        required: true,
    },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  guests: { type: Number, required: true },
  status: { type: String, default: "Pay at Location" },
  isPaid: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);