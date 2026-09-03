import React, {useRef, useEffect, useContext, useState} from 'react'
import { Container, Row, Button } from 'reactstrap'
import { NavLink, useNavigate } from 'react-router-dom'

import logo from '../../assets/images/logo.png'
import './header.css'
import { AuthContext } from '../AuthContext'

const nav__Links=[
  {
    path:'/home',
    display:'Home'
  },
  {
    path:'/about',
    display:'About'
  },
  {
    path:'/tours',
    display:'Tours'
  },
]
const Header = () => {

  const headerRef = useRef(null)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const {user,dispatch} = useContext(AuthContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const logout = () => {
    dispatch({type:'LOGOUT'})
    navigate('/home')
  }

  const toggleMenu = () => setIsMenuOpen(prev => !prev)

  useEffect(()=>{
    const stickyHeaderFunc = () => {
      if(window.scrollY > 80){
        headerRef.current?.classList.add('sticky__header')
      }else{
        headerRef.current?.classList.remove('sticky__header')
      }
    }

    window.addEventListener('scroll', stickyHeaderFunc)
    return () => window.removeEventListener('scroll', stickyHeaderFunc)
  }, [])

  // close menu when route changes or on outside click is not needed — just close on link click
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className='header' ref={headerRef}>
    <Container>
      <Row>
        <div className="nav__wrapper d-flex align-items-center justify-content-between">
          {/* ========= logo ======== */}
            <div className="logo" onClick={()=> navigate('/home')} style={{cursor:'pointer'}}> 
              <img src={logo} alt="" />
            </div>
          {/* ========= logo end ======== */}

          {/* ========= menu start ======== */}
            <div className={`navigation ${isMenuOpen ? 'show__menu' : ''}`} ref={menuRef} onClick={closeMenu}>
              <ul className="menu d-flex align-items-center gap-5">
                  {nav__Links.map((item, index) =>(
                    <li className="nav__item" key={index}>
                      <NavLink to={item.path} className={navClass=> navClass.isActive ? "active__link" : ""} onClick={closeMenu}>{item.display}</NavLink>
                    </li>
                  ))}
              </ul>
            </div>
          {/* ========= menu end ======== */}
          <div className="nav__right d-flex align-items-center gap-4">
            <div className="nav__btns d-flex align-items-center gap-4">

              {
                user? (<>
                  <h5 className='mb-0'>{user.username}</h5>
                  <Button className='btn btn-dark' onClick={logout}>Logout</Button>
                </>
                ) : (
                  <>
                    <Button className="btn secondary__btn" onClick={()=> navigate('/login')}>Login</Button>
                    <Button className="btn primary__btn" onClick={()=> navigate('/register')}>Register</Button>
                  </>
                )}    
                
            </div>

            <span className="mobile__menu" onClick={toggleMenu} role="button" aria-label="Toggle menu" aria-expanded={isMenuOpen}>
                  <i className={isMenuOpen ? "ri-close-line" : "ri-menu-line"}></i>
            </span>
          </div>
        </div>
      </Row>
    </Container>
  </header>
  ) 
}

export default Header