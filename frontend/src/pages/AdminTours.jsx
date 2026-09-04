import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../utils/config'

const AdminTours = ({ token }) => {
  const navigate = useNavigate()
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const authHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const fetchTours = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/tours?all=true`, { credentials: 'include' })
      const result = await res.json()
      if (!res.ok) throw new Error(result.message || 'Failed to fetch tours')
      setTours(result.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTours()
  }, [])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return
    try {
      const res = await fetch(`${BASE_URL}/tours/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: authHeaders,
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.message || 'Failed to delete')
      setTours(prev => prev.filter(t => t._id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <div className="admin__loading">Loading tours...</div>
  if (error) return <div className="admin__loading" style={{color:'#dc3545'}}>{error}</div>

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Tours ({tours.length})</h4>
        <button className="admin__btn add" onClick={() => navigate('/admin/tours/new')}>
          <i className="ri-add-line"></i> Add Tour
        </button>
      </div>

      {tours.length === 0 ? (
        <div className="admin__empty">No tours found.</div>
      ) : (
        <div className="admin__table-wrap">
          <table className="admin__table">
            <thead>
              <tr>
                <th>Title</th>
                <th>City</th>
                <th>Price</th>
                <th>Distance</th>
                <th>Group Size</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tours.map(tour => (
                <tr key={tour._id}>
                  <td><strong>{tour.title}</strong></td>
                  <td>{tour.city}</td>
                  <td>${tour.price}</td>
                  <td>{tour.distance} km</td>
                  <td>{tour.maxGroupSize}</td>
                  <td>{tour.featured ? '⭐ Yes' : 'No'}</td>
                  <td>
                    <div className="admin__actions">
                      <button
                        className="admin__btn edit"
                        onClick={() => navigate(`/admin/tours/edit/${tour._id}`)}
                      >
                        <i className="ri-edit-line"></i> Edit
                      </button>
                      <button
                        className="admin__btn delete"
                        onClick={() => handleDelete(tour._id, tour.title)}
                      >
                        <i className="ri-delete-bin-line"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminTours