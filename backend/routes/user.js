import express from 'express'
import {  updateUser, deleteUser, getSingleUser, getAllUser } from '../controllers/userController.js'
import { verifyUser, verifyAdmin } from '../utils/verifyToken.js'

const router = express.Router()

//update User
router.put('/:id', verifyUser, updateUser)

//delete User
router.delete('/:id', verifyUser, deleteUser)

//get Single User
router.get('/:id', verifyUser, getSingleUser)

//get All User
router.get('/', verifyAdmin, getAllUser)

export default router