import React, { useState, useEffect, useContext } from 'react'
import { Container } from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../components/AuthContext'
import { BASE_URL } from '../utils/config'
import '../styles/admin.css'

const AdminEditTour = () => {
  const { id } = useParams()
  const { token } = useContext(AuthContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
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

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await fetch(`${BASE_URL}/tours/${id}`, { credentials: 'include' })
        const result = await res.json()
        if (!res.ok) throw new Error(result.message || 'Tour not found')
        const tour = result.data
        setFormData({
          title: tour.title || '',
          city: tour.city || '',
          address: tour.address || '',
          desc: tour.desc || '',
          price: tour.price || '',
          distance: tour.distance || '',
          maxGroupSize: tour.maxGroupSize || '',
          photo: tour.photo || '',
          featured: tour.featured || false,
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchTour()
  }, [id])

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        distance: Number(formData.distance),
        maxGroupSize: Number(formData.maxGroupSize),
      }

      const res = await fetch(`${BASE_URL}/tours/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message || 'Failed to update tour')

      alert('Tour updated successfully!')
      navigate('/admin')
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin__loading">Loading tour details...</div>
  if (error) return <div className="admin__loading" style={{color:'#dc3545'}}>{error}</div>

  return (
    <section className="admin__page">
      <Container>
        <div className="d-flex align-items-center gap-3 mb-4">
          <button className="admin__btn back" onClick={() => navigate('/admin')}>
            <i className="ri-arrow-left-line"></i> Back
          </button>
          <h2>Edit Tour</h2>
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
            />
          </div>

          <div className="form__group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form__group">
            <label>Description *</label>
            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              required
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
            />
          </div>

          <div className="form__group">
            <label>Photo URL</label>
            <input
              type="text"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
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
            <button className="admin__btn add" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
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

export default AdminEditTour