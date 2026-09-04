import mongoose from 'mongoose'
import Booking from '../models/Booking.js'


//New Booking
export const createBooking = async (req, res) => {
    // assign the userId from the verified token when it isn't provided
    const userId = req.body.userId || (req.user && req.user.id)

    // sanitize guestSize — never allow 0 / empty / negative to save $10-only booking
    let guestSize = Number(req.body.guestSize)
    if (!Number.isFinite(guestSize) || guestSize < 1) {
        return res.status(400).json({success:false, message:'Guest size must be at least 1'})
    }
    guestSize = Math.floor(guestSize)

    const newBooking = new Booking({ ...req.body, userId, guestSize })

    try {
        const savedBooking = await newBooking.save()

        res.status(200).json({success:true, message:'succesfully created', data:savedBooking})
    } catch (err) {
        // surface mongoose validation (e.g., guestSize min) as 400
        if (err?.name === 'ValidationError') {
            return res.status(400).json({success:false, message: err.message})
        }
        res.status(500).json({success:false, message:'failed to create'})
    }
}

//update Booking
export const updateBooking = async (req, res) => {

    const id = req.params.id

    try {

      const updateBooking = await Booking.findByIdAndUpdate(id, {
        $set: req.body
      }, {new:true})

      res.status(200).json({
        success:true, message: "successfully updated", data:updateBooking,
      })

    } catch (error) {
        res.status(500).json({
        success:false, message: "failed to update",
      })
    }
}
//delete Booking
export const deleteBooking = async (req, res) => {
    const id = req.params.id

    try {

      await Booking.findByIdAndDelete(id)

      res.status(200).json({
        success:true, message: "successfully deleted",
      })

    } catch (error) {
        res.status(500).json({
        success:false, message: "failed to delete",
      })
    }
}
//getSingle Booking
export const getSingleBooking = async (req, res) => {
    const id = req.params.id

    try {

      // validate the booking id before querying
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success:false, message: "booking not found" })
      }

      const booking = await Booking.findById(id)

      // if the booking does not exist, return 404
      if (!booking) {
        return res.status(404).json({ success:false, message: "booking not found" })
      }

      res.status(200).json({
        success:true, message: "successfully found", data: booking,
      })

    } catch (error) {
        res.status(500).json({
        success:false, message: "failed to fetch booking",
      })
    }
}

//getAll Booking
export const getAllBooking = async (req, res) => {
  
    try {

      const bookings = await Booking.find({})

      res.status(200).json({
        success:true, message: "successfully found", data: bookings,
      })

    } catch (error) {
        res.status(500).json({
        success:false, message: "failed to fetch bookings",
      })  
    }
}

//get Booking by user
export const getBookingByUser = async (req, res) => {
    const userId = req.params.userId

    try {

      // a user can only fetch their own bookings, unless they are an admin
      if (req.user && req.user.role !== 'admin' && req.user.id !== userId) {
        return res.status(403).json({ success:false, message: "You're not authorized to view these bookings" })
      }

      const bookings = await Booking.find({ userId })

      res.status(200).json({
        success:true, message: "successfully found", data: bookings,
      })

    } catch (error) {
        res.status(500).json({
        success:false, message: "failed to fetch bookings",
      })  
    }
}
