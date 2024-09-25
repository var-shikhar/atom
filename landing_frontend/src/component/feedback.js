import React, { useState } from 'react'
import { StarRating } from './viewReview'
import ModalWrapper from './modalWrapper'

const Feedback = ({reviews = []}) => {
  const [toggle, setToggle] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const tempImage = 'https://res.cloudinary.com/attendence/image/upload/v1725618624/qreqdcfmagajxj6xvnal.webp';

  return (
    <div className=''>
      {reviews?.length > 0 ? 
        <div className='d-flex flex-column gap-2'>
          {reviews?.map((review, index) => (
            <div className='d-flex flex-column gap-2 mb-2 border rounded p-md-3' key={index+1}>
              <div className='d-flex gap-2  align-items-center'>
                <img src={`${process.env.PUBLIC_URL}/user.png`} alt={review.buyerName} className='' width={30} height={30}  />
                <div className=''>
                  <div className='fs-6 fw-bold text-truncate'>{review.buyerName}</div>
                  <small>{new Date(review.feedback?.date).toLocaleDateString('en-GB')}</small>
                </div>
              </div>
              <StarRating rating={review.feedback?.rating} starClass='fs-6' parentClass='w-auto my-md-0'  />
              <div className=''>{review.feedback?.text}</div>
              {review.feedback?.image !== '' && 
                <div>
                  <img 
                    alt={`${review.buyerName}s feedback`} 
                    src={review.feedback?.image} 
                    width={80} 
                    height={80} 
                    className='rounded cursor-pointer' 
                    onClick={() => {
                      setToggle(true)
                      setSelectedImage(tempImage)
                    }} 
                  />
                </div>
              }
            </div>
          ))}
        </div> 
      : <div className='text-center text-light'>Be the first one to review!</div>}

      <ModalWrapper toggle={toggle} setToggle={setToggle} title={'View Review Image'}>
        <div>
          {selectedImage !== '' && <img src={selectedImage} alt='feedback-img' className='h-100' /> }
        </div>
      </ModalWrapper>
    </div>
  )
}

export default Feedback