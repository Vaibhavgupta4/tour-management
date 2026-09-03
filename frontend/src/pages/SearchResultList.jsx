import {useState} from 'react'
import CommonSection from './../shared/CommonSection'
import { Container, Row, Col } from 'reactstrap'
import { useLocation } from 'react-router-dom'
import TourCard from '../shared/TourCard'
import Newsletter from '../shared/Newsletter'

const SearchResultList = () => {

  const location = useLocation()
  const [data] = useState(location.state)


  return (
    <>
      <CommonSection title={"Search Results"} />
      <section>
        <Container>
          <Row>
            {data?.length > 0 ? (
              data.map(tour => (
                <Col lg='3' className='mb-4' key={tour._id}>
                  <TourCard tour={tour} />
                </Col>
              ))
            ) : (
              <Col lg='12'>
                <h5 className='text-center'>No tours found</h5>
              </Col>
            )}
          </Row>
        </Container>
      </section>
      <Newsletter />
    </>
  )
}

export default SearchResultList