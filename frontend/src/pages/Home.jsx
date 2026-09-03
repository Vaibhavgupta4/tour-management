import React from 'react'
import '../styles/home.css'

import {Container, Row, Col} from 'reactstrap'
import heroImg from '../assets/images/hero-img01.jpg'
import heroImg02 from '../assets/images/hero-img02.jpg'
import heroVideo from '../assets/images/hero-video.mp4'
import worldImg from '../assets/images/world.png'
import experienceImg from '../assets/images/experience.png'
import Subtitle from './../shared/Subtitle'

import SearchBar from '../shared/SearchBar'
import ServiceList from '../services/ServiceList'
import FeaturedTourList from '../components/Featured-tours/FeaturedTourList'
import MasonryImagesGallery from '../components/image-gallery/MasonryImagesGallery'
import Testimonial from '../components/Testimonial/Testimonial'
import Newsletter from '../shared/Newsletter'


const home = () => {
  return <>

            {/* ====================== hero section start ================== */}
    <section>
      <Container>
        <Row>
          <Col lg='6'>
            <div className='hero__content'>
              <div className='hero__subtitle d-flex align-items-center'>
                  <Subtitle Subtitle={'know before you Go'}/>
                  <img src={worldImg} alt="" />
              </div>
              <h1>Traveling opens the door to creating{""}
                <span className='highlight'> memories</span>
              </h1>
              <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit debitis veniam dolore quasi aliquam est iure voluptatibus iusto reiciendis tenetur magni dolorem nesciunt sint, quam quidem facilis ipsa a doloremque.</p>
            </div>
          </Col>

          <Col lg='2 '>
            <div className='hero__img-box'>
              <img src={heroImg} alt="" />
            </div>
          </Col>
          <Col lg='2 '>
            <div className='hero__img-box mt-4'>
              <video src={heroVideo} alt="" controls />
            </div>
          </Col>
          <Col lg='2 '>
            <div className='hero__img-box mt-5'>
              <img src={heroImg02} alt="" />
            </div>
          </Col>

          <SearchBar />
        </Row>
      </Container>
    </section>

                {/* ====================== hero section end ================== */}
              
     <section>
        <Container>
          <Row>
            <Col lg='3'>
              <h5 className='services__subtitle'>What we serve</h5>
              <h2 className='services__title'>we offer our best services</h2>
            </Col>
            <ServiceList />
          </Row>
        </Container>
      </section>           

              {/* ============== featured tour section start ============== */}

    <section>
      <Container>
        <Row>
          <Col lg='12' className='mb-5'>
            <Subtitle Subtitle={"Explore"} />
            <h2 className="featured__tour-title">Our featured tours</h2>
          </Col>
          <FeaturedTourList />
        </Row>
      </Container>
    </section>          
               {/* ============== featured tour section end ============== */}

               
               {/* ============== experience section start ============== */}

    <section>
      <Container>
        <Row>
          <Col lg='6'>
            <div className='experience__content'>
              <Subtitle Subtitle={"Experience"} />
              <h2>
                  With our all experience <br /> we will serve you
              </h2>
              <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  <br /> Nesciunt suscipit officiis earum provident tenetur dolorem placeat repellendus molestiae,
              </p>
            </div>
            <div className="counter__wrapper d-flex align-items-center gap-5">
              <div className="counter__box">
                <span>12k+</span>
                <h6>Successful trips</h6>
              </div>
              <div className="counter__box">
                <span>2k+</span>
                <h6>Regular clients</h6>
              </div>
              <div className="counter__box">
                <span>15</span>
                <h6>years experience</h6>
              </div>
            </div>
          </Col>
          <Col lg='6'>
              <div className="experience__img">
                <img src={experienceImg} alt="" />
              </div>
          </Col>
        </Row>
      </Container>
    </section>
               {/* ============== experience section end ============== */}



               {/* ============== Gallery section start ============== */}
    <section>
      <Container>
        <Row>
          <Col lg='12'>
            <Subtitle Subtitle={'Gallery'}/>
            <h2 className='gallery_title'>
              Visit our customers tour gallery
            </h2>
          </Col>
          <Col lg='12'>
              <MasonryImagesGallery />
          </Col>
        </Row>
      </Container>
    </section>
               {/* ============== Gallery section end ============== */}


               {/* ============== Testimonials section start ============== */}
    <section>
      <Container>
        <Row>
          <Col lg='12'>
            <Subtitle Subtitle={"Fan's Love"}/>
            <h2 className="testimonial__title">What our fans say about us </h2>
          </Col>
          <Col lg='12'>
            <Testimonial />
          </Col>
        </Row>
      </Container>
    </section>
               {/* ============== Testimonials section end ============== */}


               {/* ============== NewsLetter section start ============== */}
    <Newsletter />
               {/* ============== NewsLetter section end ============== */}

  </>
}

export default home