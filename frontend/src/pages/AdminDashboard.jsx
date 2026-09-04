import React, { useState, useEffect, useContext } from 'react'
import { Container } from 'reactstrap'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../components/AuthContext'
import { BASE_URL } from '../utils/config'
import '../styles/admin.css'
import AdminTours from './AdminTours'
import AdminBookings from './AdminBookings'

const AdminDashboard = () => {
  const { user, token } = useContext(AuthContext)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // redirect if not admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/home')
    }
  }, [user, navigate])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const headers = {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }
        const res = await fetch(`${BASE_URL}/admin/stats`, {
          credentials: 'include',
          headers,
        })
        const result = await res.json()
        if (!res.ok) throw new Error(result.message || 'Failed to fetch stats')
        setStats(result.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (user?.role === 'admin') fetchStats()
  }, [user, token])

  if (!user || user.role !== 'admin') return null

  return (
    <section className="admin__page">
      <Container>
        <h2 className="mb-3">Admin Dashboard</h2>

        {/* Tabs */}
        <div className="admin__tabs">
          <button
            className={`admin__tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="ri-dashboard-line"></i> Overview
          </button>
          <button
            className={`admin__tab ${activeTab === 'tours' ? 'active' : ''}`}
            onClick={() => setActiveTab('tours')}
          >
            <i className="ri-map-pin-line"></i> Tours
          </button>
          <button
            className={`admin__tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <i className="ri-file-list-3-line"></i> Bookings
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {loading && <div className="admin__loading">Loading stats...</div>}
            {error && <div className="admin__loading" style={{color:'#dc3545'}}>{error}</div>}
            {stats && (
              <div className="admin__stats">
                <div className="admin__stat-card">
                  <div className="stat__icon tours">
                    <i className="ri-map-pin-2-line"></i>
                  </div>
                  <div className="stat__number">{stats.tourCount}</div>
                  <div className="stat__label">Total Tours</div>
                </div>
                <div className="admin__stat-card">
                  <div className="stat__icon users">
                    <i className="ri-user-line"></i>
                  </div>
                  <div className="stat__number">{stats.userCount}</div>
                  <div className="stat__label">Registered Users</div>
                </div>
                <div className="admin__stat-card">
                  <div className="stat__icon bookings">
                    <i className="ri-file-list-3-line"></i>
                  </div>
                  <div className="stat__number">{stats.bookingCount}</div>
                  <div className="stat__label">Total Bookings</div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Tours Tab */}
        {activeTab === 'tours' && <AdminTours token={token} />}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && <AdminBookings token={token} />}
      </Container>
    </section>
  )
}

export default AdminDashboard