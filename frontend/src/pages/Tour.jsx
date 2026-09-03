import React, { useState, useEffect } from 'react'
import CommonSection from '../shared/CommonSection'
import '../styles/tour.css'
import TourCard from './../shared/TourCard'
import SearchBar from './../shared/SearchBar'
import NewsLetter from './../shared/Newsletter'
import { Col, Container, Row } from 'reactstrap'
import useFetch from '../hooks/useFetch'
import {BASE_URL} from '../utils/config'

const PAGE_SIZE = 8

const Tour = () => {
  const [pageCount, setPageCount] = useState(0)
  const [page, setPage] = useState(0)
  const { data: tours, error, loading } = useFetch(`${BASE_URL}/tours?page=${page}`)
  const { data: tourCount } = useFetch(`${BASE_URL}/tours/search/getTourCount`)

  useEffect(() => {
    const totalTours = tourCount
    const pages = Math.ceil(totalTours / PAGE_SIZE)
    setPageCount(pages > 0 ? pages : 0)
  }, [tourCount])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  return (
    <>
      <CommonSection title={"All Tours"}/>
      <section>
        <Container>
          <Row>
            <SearchBar />
          </Row>
        </Container>
      </section>
      <section className='pt-0'>
        <Container>
          <Row>
            {loading && <Col lg='12'><h4 className='text-center'>loading.................</h4></Col>}
            {error && <Col lg='12'><h4 className='text-center'>{error}</h4></Col>}

            {tours
              ?.map(tour => (
                <Col lg='3' className='mb-4' key={tour._id}>
                  <TourCard tour={tour}/>
                </Col>
              ))}

            <Col lg='12'>
              <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
                {[...Array(pageCount).keys()].map(number => (
                  <span
                    key={number}
                    className={page === number ? "active__page" : ""}
                    onClick={() => setPage(number)}
                  >
                    {number + 1}
                  </span>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <NewsLetter />
    </>
  )
}

export default Tour