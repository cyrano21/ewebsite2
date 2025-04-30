// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';

// import required modules
import { Autoplay } from 'swiper/modules';
import { sponsorNestle, sponsorDisney, sponsorAirbnb, sponsorGrab, sponsorNetflix, sponsorIle } from '../../utils/imageImports';


const sponsorList = [
    { imgUrl: sponsorIle, imgAlt: 'ile' },
    { imgUrl: sponsorNestle, imgAlt: 'Nestlé' },
    { imgUrl: sponsorDisney, imgAlt: 'Disney' },
    { imgUrl: sponsorAirbnb, imgAlt: 'airbnb' },
    { imgUrl: sponsorGrab, imgAlt: 'Grab' },
    { imgUrl: sponsorNetflix, imgAlt: 'Netflix' }
];


const Sponsor = () => {
    return (
        <div className="sponsor-section section-bg">
            <div className="container">
                <div className="section-wrapper">
                    <div className="sponsor-slider">
                        <Swiper
  spaceBetween={20}
  slidesPerView={2}
  loop={true}
  loopedSlides={sponsorList.length}
  watchOverflow={false}
  autoplay={{
    delay: 2000,
    disableOnInteraction: false,
  }}
  modules={[Autoplay]}
>


                            {sponsorList.map((val, i) => (
                                <SwiperSlide key={i}>
                                    <div className="sponsor-iten">
                                        <div className="sponsor-thumb">
                                            <img src={`${val.imgUrl}`} alt={`${val.imgAlt}`} />
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default Sponsor;
