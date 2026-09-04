import React, { useState, useEffect } from 'react'
import { BASE_URL } from '../utils/config'

const AdminBookings = ({ token }) => {
  const [bookings, setBookings] = useState([])
  const [tours, setTours] = useState({})
  const [users, setUsers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const authHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const headers = {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }

        // Fetch bookings, tours, and users in parallel
        const [bookingRes, tourRes, userRes] = await Promise.all([
          fetch(`${BASE_URL}/booking`, { credentials: 'include', headers }),
          fetch(`${BASE_URL}/tours?all=true`, { credentials: 'include' }),
          fetch(`${BASE_URL}/users`, { credentials: 'include', headers }),
        ])

        const bookingResult = await bookingRes.json()
        const tourResult = await tourRes.json()
        const userResult = await userRes.json()

        if (!bookingRes.ok) throw new Error(bookingResult.message || 'Failed to fetch bookings')

        // Build lookup maps
        const tourMap = {}
        if (tourRes.ok && tourResult.data) {
          tourResult.data.forEach(t => { tourMap[t._id] = t })
        }

        const userMap = {}
        if (userRes.ok && userResult.data) {
          userResult.data.forEach(u => { userMap[u._id] = u })
        }

        setBookings(bookingResult.data || [])
        setTours(tourMap)
        setUsers(userMap)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [token])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return
    try {
      const res = await fetch(`${BASE_URL}/booking/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: authHeaders,
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.message || 'Failed to delete')
      setBookings(prev => prev.filter(b => b._id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <div className="admin__loading">Loading bookings...</div>
  if (error) return <div className="admin__loading" style={{color:'#dc3545'}}>{error}</div>

  return (
    <div>
      <h4 className="mb-3">All Bookings ({bookings.length})</h4>

      {bookings.length === 0 ? (
        <div className="admin__empty">No bookings found.</div>
      ) : (
        <div className="admin__table-wrap">
          <table className="admin__table">
            <thead>
              <tr>
                <th>Tour</th>
                <th>User</th>
                <th>Phone</th>
                <th>Guest Size</th>
                <th>Booked At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => {
                const tour = tours[booking.tourId]
                const user = users[booking.userId]
                return (
                  <tr key={booking._id}>
                    <td><strong>{tour ? tour.title : booking.tourId}</strong></td>
                    <td>{user ? user.username : booking.userId}</td>
                    <td>{booking.phone}</td>
                    <td>{booking.guestSize}</td>
                    <td>{booking.bookAt ? new Date(booking.bookAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}</td>
                    <td>
                      <div className="admin__actions">
                        <button
                          className="admin__btn delete"
                          onClick={() => handleDelete(booking._id)}
                        >
                          <i className="ri-delete-bin-line"></i> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminBookings