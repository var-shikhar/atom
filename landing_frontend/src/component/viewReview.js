import React from "react"
import { Button } from "react-bootstrap"
import { Link } from "react-router-dom"

const ViewReview = ({text, imageURL, rating}) => {
    return (
        <div className='d-flex flex-column gap-2 text-light align-items-start'>
            <div className='fw-bold mb-2 border-bottom'>Customer Review:</div>
            <StarRating rating={rating} />
            <div>{text}</div>
            {imageURL !== '' && 
                <Link to={imageURL}>
                    <Button type='button' className='mt-2' size='sm'>
                        View Image
                    </Button>
                </Link>
            }
        </div>
    )
}


export const StarRating = ({ rating = 0, starClass='', parentClass = '' }) => {
    return (
        <div className={`radio bg-inherit d-flex justify-content-around w-md-50 me-auto my-2 ${parentClass}`}>
            {[5, 4, 3, 2, 1].map((value) => (
                <React.Fragment key={value}>
                    <label
                        htmlFor={`rating-${value}`}
                        title={`${value} stars`}
                        className={`bg-transparent ${starClass}`}
                    >
                        <svg
                            viewBox="0 0 576 512"
                            height="1em"
                            xmlns="http://www.w3.org/2000/svg"
                            className="bg-transparent"
                        >
                            <path
                                d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                                fill={value <= rating ? "#FFD700" : "#D3D3D3"}
                            />
                        </svg>
                    </label>
                </React.Fragment>
            ))}
        </div>
    );
};

export default ViewReview