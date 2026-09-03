import express from 'express'
import { createBooking, updateBooking, deleteBooking, getSingleBooking, getAllBooking, getBookingByUser } from '../controllers/bookingController.js'
import { verifyToken, verifyAdmin } from '../utils/verifyToken.js'

const router = express.Router()

//Create new booking (any logged-in user)
router.post('/', verifyToken, createBooking)

//update booking
router.put('/:id', verifyAdmin, updateBooking)

//delete booking
router.delete('/:id', verifyAdmin, deleteBooking)

//get booking by user (must be defined before /:id)
router.get('/user/:userId', verifyToken, getBookingByUser)

//get Single booking
router.get('/:id', verifyAdmin, getSingleBooking)

//get All booking
router.get('/', verifyAdmin, getAllBooking)

export default router
