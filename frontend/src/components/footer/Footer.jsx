import React from 'react'
import './footer.css'

import { Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap'

import { Link } from 'react-router-dom'
import logo from '../../assets/images/logo.png'

const quick__links = [
  {
    path: '/home',
    display: 'Home'
  },
  {
    path: '/about',
    display: 'About'
  },
  {
    path: '/tours',
    display: 'Tours'
  },
]
const quick__links2 = [
  {
    path: '/gallery',
    display: 'Gallery'
  },
  {
    path: '/Login',
    display: 'Login'
  },
  {
    path: '/register',
    display: 'Register'
  },
]

const footer = () => {

  const year = new Date().getFullYear()

  return (
    <footer className='footer'>
      <Container>
        <Row>
          <Col lg='3' md='12' sm='12' className="footer__col footer__col--brand mb-4 mb-lg-0">
            <div className='logo'>
              <img src={logo} alt="" />
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore rerum a tempore voluptatem inventore natus consectetur sed,</p>
              <div className='social__links d-flex align-items-center gap-3'>
                <span>
                  <Link to='#'><i className='ri-youtube-line'></i></Link>
                </span>
                <span>
                  <Link to='#'><i className="ri-github-fill"></i></Link>
                </span>
                <span>
                  <Link to='#'><i className="ri-facebook-circle-line"></i></Link>
                </span>
                <span>
                  <Link to='#'><i className="ri-instagram-line"></i></Link>
                </span>
              </div>
            </div>
          </Col>

          <Col lg='3' md='6' sm='6' xs='6' className="footer__col footer__col--links">
            <h5 className='footer__links-title'>Discover</h5>
            <ListGroup className='footer__quick-links'>
              {
                quick__links.map((item, index) => (
                  <ListGroupItem key={index} className='ps-0 border-0'>
                    <Link to={item.path}>{item.display}</Link>
                  </ListGroupItem>
                ))
              }
            </ListGroup>
          </Col>
          <Col lg='3' md='6' sm='6' xs='6' className="footer__col footer__col--links">
            <h5 className='footer__links-title'>Quick Links</h5>
            <ListGroup className='footer__quick-links'>
              {
                quick__links2.map((item, index) => (
                  <ListGroupItem key={index} className='ps-0 border-0'>
                    <Link to={item.path}>{item.display}</Link>
                  </ListGroupItem>
                ))
              }
            </ListGroup>
          </Col>
          <Col lg='3' md='12' sm='12' className="footer__col footer__col--contact">
            <h5 className='footer__links-title'>Contact</h5>
            <ListGroup className='footer__quick-links'>
              <ListGroupItem className='ps-0 border-0 d-flex align-items-center gap-3 flex-wrap'>
                <h6 className='mb-0 d-flex align-items-center gap-2'>
                  <span><i className="ri-map-pin-line"></i></span>Address:
                </h6>
                <p className="mb-0">Chandigarh, India</p>
              </ListGroupItem>
              <ListGroupItem className='ps-0 border-0 d-flex align-items-center gap-3 flex-wrap'>
                <h6 className='mb-0 d-flex align-items-center gap-2'>
                  <span><i className="ri-mail-line"></i></span>Email:
                </h6>
                <p className="mb-0">sales@travelworld.com</p>
              </ListGroupItem>
              <ListGroupItem className='ps-0 border-0 d-flex align-items-center gap-3 flex-wrap'>
                <h6 className='mb-0 d-flex align-items-center gap-2'>
                  <span><i className="ri-phone-fill"></i></span>Mobile:
                </h6>
                <p className="mb-0">+919501019942</p>
              </ListGroupItem>
            </ListGroup>
          </Col>

          <Col lg='12' className='text-center pt-4 pt-md-5'>
              <p className='copyright mb-0'>Copyright {year}, designed and developed by Vaibhav Gupta. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default footer