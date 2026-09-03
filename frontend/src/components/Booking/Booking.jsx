import React, {useState, useContext} from 'react'
import './booking.css'
import { Form, FormGroup, ListGroup, ListGroupItem, Button } from 'reactstrap'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthContext'
import {BASE_URL} from '../../utils/config'

const Booking = ({ tour, avgRating }) => {

  const { price, reviews, title: tourName } = tour
  const navigate = useNavigate()
  const { user, token } = useContext(AuthContext)

  const [bookingData, setBookingData] = useState({
    fullName: '',
    phone: '',
    guestSize: 1,
    bookAt: '',
  })

  const handleChange = e => {
    setBookingData(prev=>({...prev, [e.target.id]:e.target.value}))
  }

  const serviceFee = 10
  const totalAmount  = Number(price) * Number(bookingData.guestSize) + Number(serviceFee)

  const handleClick = async e=>{
    e.preventDefault()

    if (!user) {
      alert('Please sign in to book a tour')
      return navigate("/login")
    }

    try {
      const payload = {
        userId: user._id,
        userEmail: user.email,
        tourName: tourName || tour.title,
        fullName: bookingData.fullName,
        phone: bookingData.phone,
        guestSize: Number(bookingData.guestSize),
        bookAt: bookingData.bookAt,
      }

      const headers = { 'content-type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`
      const res = await fetch(`${BASE_URL}/booking`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(payload)
      })
      const result = await res.json()
      if (!res.ok) {
        alert(result.message || 'Booking failed')
        return
      }
      navigate("/thank-you")
    } catch (err) {
      alert(err.message || 'Booking failed')
    }
  }

  return <div className="booking">
    <div className="booking__top d-flex align-items-center justify-content-between">
      <h3>${price}<span>/per person</span></h3>
      <span className='tour__rating d-flex align-items-center gap-1'>
        <i className='ri-star-s-fill' style={{ color: "var(--secondary-color)" }}></i>
        {avgRating === 0 ? null : avgRating} ({reviews?.length})
      </span>
    </div>


    <div className="booking__form">
      <h5>Information</h5>
      <Form className='booking__info-form' onSubmit={handleClick}>
        <FormGroup>
          <input type="text" placeholder='Full Name' id='fullName' required onChange={handleChange}/>
        </FormGroup>
        <FormGroup>
          <input type="number" placeholder='Phone' id='phone' required onChange={handleChange}/>
        </FormGroup>
        <FormGroup className='d-flex align-items-center gap-3'>
          <input type="date" placeholder='' id='bookAt' required onChange={handleChange}/>
          <input type="number" placeholder='guest' id='guestSize' required onChange={handleChange}/>
        </FormGroup>
      </Form>
    </div>


    <div className="booking__bottom">
      <ListGroup>
        <ListGroupItem className='border-0 px-0'>
          <h5>${price} <i className="ri-close-line"></i> 1 person </h5>
          <span> ${price}</span>
        </ListGroupItem>
        <ListGroupItem className='border-0 px-0'>
          <h5>Service Charge </h5>
          <span> $10</span>
        </ListGroupItem>
        <ListGroupItem className='border-0 px-0 total'>
          <h5>Total</h5>
          <span> ${totalAmount}</span>
        </ListGroupItem>
      </ListGroup>

      <Button className='btn primary__btn w-100 mt-4' onClick={handleClick}>Book Now</Button>
    </div>
  </div>
}

export default Booking