import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import Subtitle from '../shared/Subtitle'

const About = () => {
  return (
    <section>
      <Container>
        <Row>
          <Col lg='12'>
            <Subtitle Subtitle={'About Us'} />
            <h2 className="tour__title">Welcome to TravelWorld</h2>
            <p>
              We are a passionate team of travel enthusiasts dedicated to helping you
              discover the world's most beautiful destinations. Our mission is to provide
              unforgettable travel experiences that create lasting memories.
            </p>
            <p>
              Whether you're looking for adventure, relaxation, or cultural exploration,
              we have something for everyone. Our carefully curated tours are designed to
              give you the best experience at the most affordable prices.
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default About
