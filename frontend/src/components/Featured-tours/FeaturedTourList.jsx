import TourCard from '../../shared/TourCard'
import { Col } from 'reactstrap'
import useFetch from '../../hooks/useFetch'
import {BASE_URL} from '../../utils/config'

const FeaturedTourList = () => {

  const { data: featuredTours, error, loading } = useFetch(`${BASE_URL}/tours/search/getFeaturedTours`)

  return (
    <>
          {
            loading && <h4>loading.................</h4>
          }
          {
            error && <h4>{error}</h4>
          }
        {featuredTours?.map(tour => (
            <Col lg='3' className='mb-4' key={tour._id}>
                <TourCard tour={tour}/>
            </Col>
        ))}
    </>
  );
}

export default FeaturedTourList