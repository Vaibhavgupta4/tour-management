import React, { useState, useContext } from 'react'
import { Container } from 'reactstrap'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../components/AuthContext'
import { BASE_URL } from '../utils/config'
import '../styles/admin.css'

const AdminCreateTour = () => {
  const { token } = useContext(AuthContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    city: '',
    address: '',
    desc: '',
    price: '',
    distance: '',
    maxGroupSize: '',
    photo: '',
    featured: false,
  })

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        distance: Number(formData.distance),
        maxGroupSize: Number(formData.maxGroupSize),
      }

      const res = await fetch(`${BASE_URL}/tours`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message || JSON.stringify(result) || 'Failed to create tour')

      alert('Tour created successfully!')
      navigate('/admin')
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="admin__page">
      <Container>
        <div className="d-flex align-items-center gap-3 mb-4">
          <button className="admin__btn back" onClick={() => navigate('/admin')}>
            <i className="ri-arrow-left-line"></i> Back
          </button>
          <h2>Create New Tour</h2>
        </div>

        <form className="admin__form" onSubmit={handleSubmit}>
          <div className="form__group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. Bali Sunset Adventure"
            />
          </div>

          <div className="form__group">
            <label>City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="e.g. Bali"
            />
          </div>

          <div className="form__group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. Jl. Raya Ubud No.88"
            />
          </div>

          <div className="form__group">
            <label>Description *</label>
            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              required
              placeholder="Describe the tour experience..."
            />
          </div>

          <div className="form__group">
            <label>Price ($) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="1"
              placeholder="e.g. 49"
            />
          </div>

          <div className="form__group">
            <label>Distance (km) *</label>
            <input
              type="number"
              name="distance"
              value={formData.distance}
              onChange={handleChange}
              required
              min="1"
              placeholder="e.g. 10"
            />
          </div>

          <div className="form__group">
            <label>Max Group Size *</label>
            <input
              type="number"
              name="maxGroupSize"
              value={formData.maxGroupSize}
              onChange={handleChange}
              required
              min="1"
              placeholder="e.g. 30"
            />
          </div>

          <div className="form__group">
            <label>Photo URL</label>
            <input
              type="text"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form__group form__check">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              id="featured"
            />
            <label htmlFor="featured">Featured Tour</label>
          </div>

          <div className="form__btns">
            <button className="admin__btn add" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Tour'}
            </button>
            <button
              className="admin__btn cancel"
              type="button"
              onClick={() => navigate('/admin')}
            >
              Cancel
            </button>
          </div>
        </form>
      </Container>
    </section>
  )
}

export default AdminCreateTour