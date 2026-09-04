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
    const { id, value } = e.target
    // guestSize: never allow empty/0/negative to break the total — clamp to >=1
    // keep controlled input but sanitize on every keystroke
    if (id === 'guestSize') {
      if (value === '') {
        setBookingData(prev=>({...prev, [id]: ''}))
        return
      }
      const num = Number(value)
      if (!Number.isFinite(num) || num < 1) {
        setBookingData(prev=>({...prev, [id]: 1}))
        return
      }
      // floor to avoid decimals, cap at reasonable max if needed
      setBookingData(prev=>({...prev, [id]: Math.floor(num)}))
      return
    }
    setBookingData(prev=>({...prev, [id]:value}))
  }

  const handleGuestBlur = () => {
    // if user leaves field empty, restore default 1 so total never shows only service fee
    const n = Number(bookingData.guestSize)
    if (bookingData.guestSize === '' || !Number.isFinite(n) || n < 1) {
      setBookingData(prev=>({...prev, guestSize: 1}))
    }
  }

  const serviceFee = 10
  // always count at least 1 guest — empty string or 0 would otherwise make price * 0 + fee = $10
  const safeGuestSize = (() => {
    const n = Number(bookingData.guestSize)
    if (!Number.isFinite(n) || n < 1) return 1
    return Math.floor(n)
  })()
  const totalAmount  = Number(price) * safeGuestSize + Number(serviceFee)

  const handleClick = async e=>{
    e.preventDefault()

    if (!user) {
      alert('Please sign in to book a tour')
      return navigate("/login")
    }

    // clamp guest strictly before sending — empty field must count as 1
    if (!safeGuestSize || safeGuestSize < 1) {
      setBookingData(prev=>({...prev, guestSize: 1}))
      alert('Guest size must be at least 1')
      return
    }

    try {
      const payload = {
        userId: user._id,
        userEmail: user.email,
        tourName: tourName || tour.title,
        fullName: bookingData.fullName,
        phone: bookingData.phone,
        guestSize: safeGuestSize,
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
          <input type="text" placeholder='Full Name' id='fullName' required value={bookingData.fullName} onChange={handleChange}/>
        </FormGroup>
        <FormGroup>
          <input type="number" placeholder='Phone' id='phone' required value={bookingData.phone} onChange={handleChange}/>
        </FormGroup>
        <FormGroup className='d-flex align-items-center gap-3'>
          <input type="date" placeholder='' id='bookAt' required value={bookingData.bookAt} onChange={handleChange}/>
          <input type="number" placeholder='guest' id='guestSize' required
            min="1" step="1"
            value={bookingData.guestSize}
            onChange={handleChange}
            onBlur={handleGuestBlur}/>
        </FormGroup>
      </Form>
    </div>


    <div className="booking__bottom">
      <ListGroup>
        <ListGroupItem className='border-0 px-0'>
          <h5>${price} <i className="ri-close-line"></i> {safeGuestSize} person{safeGuestSize > 1 ? 's' : ''} </h5>
          <span> ${Number(price) * safeGuestSize}</span>
        </ListGroupItem>
        <ListGroupItem className='border-0 px-0'>
          <h5>Service Charge </h5>
          <span> ${serviceFee}</span>
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