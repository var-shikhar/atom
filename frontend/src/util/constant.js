const ORDER_STATUS = [
    {
        id: 1,
        status: 'Processing',
        slug: 'Processing'
    },
    {
        id: 2,
        status: 'Shipped',
        slug: 'Shipped'
    },
    {
        id: 3,
        status: 'Delivered',
        slug: 'Delivered'
    },
    {
        id: 4,
        status: 'Cancelled',
        slug: 'Cancelled'
    },
    {
        id: 5,
        status: 'Returned',
        slug: 'Returned'
    },
]

const CONTACT_LEAD_STATUS = [
    {
        id: 1,
        status: 'Processing',
        slug: 'Processing'
    },
    {
        id: 2,
        status: 'Resolved',
        slug: 'Resolved'
    },
    {
        id: 3,
        status: 'Rejected',
        slug: 'Rejected'
    },
]


const CONSTANT = { ORDER_STATUS, CONTACT_LEAD_STATUS }

export default CONSTANT; 