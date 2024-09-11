import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

const LandingPage = () => {
  const carouselImages = ['banner-1.avif', 'banner-2.avif', 'banner-3.avif', 'banner-4.avif'];

  return (    
    <div>
      <Carousel fade className='carousel-container'>
        {carouselImages?.map((image, index) => 
          <Carousel.Item key={index+1}>
            <img alt="Atom" src={`${process.env.PUBLIC_URL}/${image}`} className='carousel-image' />
          </Carousel.Item>
        )}
      </Carousel>
      <section className='container py-md-3'>
        <div className='row side_wrapper'>
          <div className='col-12 col-md-6 h-auto'>
            <div className='side_body'>
              <div className='heading slide-up'>Unleash the Beat with TG11 Ear Buds</div>
              <div className='text-light slide-up-2s'>Your ultimate companion for music especially designed for music lovers and audiophiles who crave powerful bass, crisp highs, and an immersive sound experience. Get ready to elevate your music to new heights with our state-of-the-art earbuds.</div>
            </div>
          </div>
          <div className='col-12 col-md-6'>
            <div className='side_images slide-up'>
              <img src={`${process.env.PUBLIC_URL}/gallery-1.avif`} alt='' />
            </div>
          </div>
        </div>
      </section>
      <section className='bg-light py-md-3'>
        <div className='container'>
          <div className='row side_wrapper'>
            <div className='col-12 col-md-6'>
              <div className='side_images slide-up'>
                <img src={`${process.env.PUBLIC_URL}/gallery-2.avif`} alt='' />
              </div>
            </div>
            <div className='col-12 col-md-6 h-auto'>
              <div className='side_body'>
                <div className='heading text-extra-dark slide-up'>Experience Low Latency Game Mode With TG10 Ear Buds</div>
                <div className='text-dark slide-up-2s'>Introducing our revolutionary low latency earbuds, designed to provide an unparalleled gaming experience. Whether you're a gamer, a music enthusiast, or simply someone who values crystal-clear sound with minimal delay, our low-latency earbuds are the perfect choice.</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='joining_block p-md-5 '>
        <div className='display-4 text-light'>
          Join the revolution with ATOM ear buds!
        </div>
      </section>
      <section className='container py-md-3'>
        <div className='row side_wrapper'>
          <div className='col-12 col-md-6 h-auto'>
            <div className='side_body'>
              <div className='heading slide-up'>24x7 Customer Support</div>
              <div className='text-light slide-up-2s'>At ATOM, we believe in providing the best customer service possible. That's why we offer 24x7 support to our customers. Whether you have a question about our products or need help with an order, our support team is ready to assist you anytime, anywhere. Contact us today!</div>
            </div>
          </div>
          <div className='col-12 col-md-6'>
            <div className='side_images slide-up'>
              <img src={`${process.env.PUBLIC_URL}/gallery-4.avif`} alt='' />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage