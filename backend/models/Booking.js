import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    userEmail: {
      type: String,
    },
    tourName: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    guestSize: {
      type: Number,
      required: true,
      min: [1, 'Guest size must be at least 1'],
      validate: {
        validator: v => Number.isInteger(v) && v >= 1,
        message: 'Guest size must be an integer >= 1',
      },
    },
    bookAt: {
      type: Date,
      // required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
