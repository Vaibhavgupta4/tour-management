import ServiceCard from './ServiceCard'
import { Col } from 'reactstrap'
import weathering from '../assets/images/weather.png'
import guideImg from '../assets/images/guide.png'
import customizationImg from '../assets/images/customization.png'


const servicesData = [
    {
        imgUrl: weathering,
        title: "Calculate weather",
        desc: "Lorem ipsum dolor sit amet consectetur, adipisicing elit."
    },
    {
        imgUrl: guideImg,
        title: "best tour Guide",
        desc: "Lorem ipsum dolor sit amet consectetur, adipisicing elit."
    },
    {
        imgUrl: customizationImg,
        title: "Customization",
        desc: "Lorem ipsum dolor sit amet consectetur, adipisicing elit."
    },
];

const ServiceList = () => {
    return (
        <>
            {servicesData.map((item, index) => (
                <Col lg='3' key={index}>
                    <ServiceCard item={item} />
                </Col>
            ))}
        </>
    )
}

export default ServiceList;