import express from 'express'
import { createTour, updateTour, deleteTour, getSingleTour, getAllTour, getTourBySearch, getFeaturedTour, getTourCount } from '../controllers/tourController.js'
import { verifyAdmin } from '../utils/verifyToken.js'

const router = express.Router()

//Create new tour
router.post('/', verifyAdmin, createTour)

//update tour
router.put('/:id', verifyAdmin, updateTour)

//delete tour
router.delete('/:id', verifyAdmin,deleteTour)

//get tour by search (must be defined before /:id)
router.get('/search/getTourBySearch', getTourBySearch)

//get Featured Tour
router.get('/search/getFeaturedTours', getFeaturedTour)

//get Tour Count
router.get('/search/getTourCount', getTourCount)

//get Single tour
router.get('/:id', getSingleTour)

//get All tour
router.get('/', getAllTour)



export default router