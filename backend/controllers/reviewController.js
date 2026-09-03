import mongoose from "mongoose"
import Tour from "../models/Tour.js"
import Review from '../models/Review.js'

export const createReview = async (req, res ) => {

  const tourId = req.params.tourId

  try {
    // validate the tour id before proceeding
    if (!tourId || !mongoose.Types.ObjectId.isValid(tourId)) {
      return res.status(400).json({ success: false, message: "Invalid tour id" })
    }

    // make sure the tour actually exists
    const tour = await Tour.findById(tourId)
    if (!tour) {
      return res.status(404).json({ success: false, message: "Tour not found" })
    }

    const newReview = new Review({
      tourId,
      username: req.body.username,
      reviewText: req.body.reviewText,
      rating: req.body.rating,
    })

    const savedReview = await newReview.save()
    await Tour.findByIdAndUpdate(tourId, {
      $push: { reviews: savedReview._id }
    })

    res.status(200).json({ success: true, message: 'Review submitted', data: savedReview })

  } catch (error) {
    res.status(500).json({ success: false, message: 'failed to submit' })
  }
}