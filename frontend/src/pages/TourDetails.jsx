import React, { useRef, useState, useContext } from 'react'
import '../styles/tour-details.css'

import { Container, Row, Col, Form, ListGroup } from 'reactstrap'
import { useParams, useNavigate } from 'react-router-dom'
import calculateAvgRating from './../utils/avgRating'
import avatar from '../assets/images/avatar.jpg'
import Booking from '../components/Booking/Booking'
import NewsLetter from '../shared/Newsletter'
import useFetch from '../hooks/useFetch'
import {BASE_URL} from '../utils/config'
import { AuthContext } from '../components/AuthContext'

const TourDetails = () => {

  const { id } = useParams()
  const navigate = useNavigate()
  const { user, token } = useContext(AuthContext)

  const reviewMsgRef = useRef()
  const [tourRating, setTourRating] = useState(null)
  const [hoverRating, setHoverRating] = useState(0)

  const { data: tour, loading, error } = useFetch(`${BASE_URL}/tours/${id}`)

  const { photo, title, desc, price, reviews, city, address, distance, maxGroupSize } = tour || {}

  const { totalRating, avgRating } = calculateAvgRating(reviews)
  
  const options = { day: 'numeric', month: 'long', year: 'numeric'}

  const submitHandler = async e =>{
    e.preventDefault()
    if (!user) {
      alert('Please sign in to submit a review')
      return navigate('/login')
    }
    const reviewText = reviewMsgRef.current?.value?.trim()
    if (!tourRating) {
      return alert('Please select a rating')
    }
    if (!reviewText) {
      return alert('Please enter a review')
    }
    try {
      const headers = { 'content-type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`
      const res = await fetch(`${BASE_URL}/review/${id}`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ username: user.username || 'User', reviewText, rating: tourRating })
      })
      const result = await res.json()
      if (!res.ok) {
        alert(result.message || 'Failed to submit review')
        return
      }
      alert('Review submitted!')
      if (reviewMsgRef.current) reviewMsgRef.current.value = ''
      setTourRating(null)
      window.location.reload()
    } catch (err) {
      alert(err.message || 'Failed to submit review')
    }
  }

  return <>
    <section>
      <Container>
        {!loading && !error && tour && !Array.isArray(tour) && (
          <Row>
            <Col lg='8'>
              <div className="tour__content">
                <img src={photo} alt="" />
                <div className="tour__info">
                  <h2>{title}</h2>
                  <div className='d-flex align-items-center gap-5'>
                    <span className='tour__rating d-flex align-items-center gap-1'>
                      <i className='ri-star-s-fill' style={{ color: "var(--secondary-color)" }}></i>
                      {avgRating === 0 ? null : avgRating}
                      {totalRating === 0 ? (
                        "not rated"
                      ) : (
                        <span>({reviews?.length})</span>
                      )
                      }
                    </span>
                    <span>
                      <i className="ri-map-pin-user-line"></i> {address}
                    </span>
                  </div>
                  <div className="tour__extra-details">
                    <span><i className="ri-map-pin-2-line"></i> {city}</span>
                    <span><i className="ri-money-dollar-circle-line"></i> ${price} / per person</span>
                    <span><i className="ri-map-pin-time-line"></i> {distance} K/m</span>
                    <span><i className="ri-group-line"></i> {maxGroupSize} people</span>
                  </div>
                  <h5>Description</h5>
                  <p>{desc}</p>
                </div>


                <div className="tour__reviews mt-4">
                  <h4>Reviews ({reviews?.length} reviews)</h4>

                  <Form onSubmit={submitHandler}>
                    <div className="d-flex align-items-center gap-3 mb-4 rating__group">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span
                          key={star}
                          onClick={() => setTourRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className={((tourRating || hoverRating) >= star) ? "active" : ""}
                        >
                          {star} <i className="ri-star-s-fill"></i>
                        </span>
                      ))}
                    </div>

                    <div className='review__input'>
                      <input type="text" ref={reviewMsgRef} placeholder='share your thoughts' required />
                      <button className='btn primary__btn text-white' type='submit'>
                        Submit
                      </button>
                    </div>
                  </Form>

                  <ListGroup className='user__reviews'>
                      {
                        reviews?.map((review, index)=>(
                          <div key={review._id || index} className="review__item">
                            <img src={avatar} alt="" />
                            <div className='w-100'>
                              <div className="d-flex align-items-center justify-content-between">
                                <div>
                                  <h5>{review.username}</h5>
                              <p>
                                {review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-US",options) : ''}
                              </p>
                                </div>
                                <span className='d-flex align-items-center'> 
                                  {review.rating}<i className="ri-star-s-fill"></i></span>
                              </div>
                              <h6>{review.reviewText}</h6>
                            </div>
                          </div>
                        ))
                      }
                  </ListGroup>
                </div>
              </div>
            </Col>
            <Col>
              <Booking tour={tour} avgRating={avgRating} />
            </Col>
          </Row>
        )}
      </Container>
      {loading && <h4 className='text-center pt-5'>Loading......</h4>}
      {error && <h4 className='text-center pt-5'>{error}</h4>}
      {!loading && !error && (!tour || (Array.isArray(tour) && tour.length === 0)) && (
        <h4 className='text-center pt-5'>Tour not found</h4>
      )}
    </section>
    <NewsLetter />
  </>
}

export default TourDetails