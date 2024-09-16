import { Button } from "react-bootstrap"
import { Link } from "react-router-dom"

const ViewReview = ({text, imageURL}) => {
    return (
      <div className='d-flex flex-column gap-2 text-light align-items-start'>
          <div className='fw-bold mb-2 border-bottom'>Customer Review:</div>
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

  export default ViewReview