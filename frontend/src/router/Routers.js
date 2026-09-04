import React from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'

import Home from '../pages/Home';
import Tours from '../pages/Tour';
import TourDetails from '../pages/TourDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';
import SearchResultList from '../pages/SearchResultList';
import About from '../pages/About';
import ThankYou from '../pages/ThankYou';
import AdminDashboard from '../pages/AdminDashboard';
import AdminCreateTour from '../pages/AdminCreateTour';
import AdminEditTour from '../pages/AdminEditTour';

const Routers = () => {
  return (
    <Routes>
        <Route path='/' element={<Navigate to ='/home'/>} />
        <Route path='/home' element={<Home/>} />
        <Route path='/tours' element={<Tours/>} />
        <Route path='/tour/:id' element={<TourDetails/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/thank-you' element={<ThankYou />} />
        <Route path='/about' element={<About/>} />
        <Route path='/tours/search' element={<SearchResultList/>} />
        <Route path='/admin' element={<AdminDashboard/>} />
        <Route path='/admin/tours/new' element={<AdminCreateTour/>} />
        <Route path='/admin/tours/edit/:id' element={<AdminEditTour/>} />
    </Routes>
  )
}

export default Routers