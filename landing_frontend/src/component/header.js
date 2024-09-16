import React from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/authContext';
import useAxioRequests from '../function/axioRequest';
import ContentRoute from '../routes/routes';
import ROUTES from '../util/routes';
import { useCart } from '../context/cartContext';
import { useWishList } from '../context/wishlistContext';


const Header = () => {
  const { userID, userData } = useAuthContext();
  const { defaultRoutes } = ContentRoute();
  const {isOpen, setISOpen} = useCart();
  const { wISOpen, setWISOpen } = useWishList();
  const { HandleGetRequest } = useAxioRequests()

  
  const handleLogout = async () => {
    try {
      const response = await HandleGetRequest(ROUTES.logoutRoute);
  
      if (response?.status === 200) {
        const cartData = userData?.cart || [];     
        
        localStorage.setItem('localCart', JSON.stringify(cartData));
  
        sessionStorage.removeItem('userID');
        sessionStorage.removeItem('userData');

        window.location.href = '/get-started';
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  

  return (
    <>
        <Navbar collapseOnSelect expand="lg" className="">
            <Container>
                <Navbar.Brand href="/">
                    <img
                        alt="Atom"
                        src={`${process.env.PUBLIC_URL}/logo-1.png`}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                    {Array.isArray(defaultRoutes) && defaultRoutes?.length > 0 && defaultRoutes?.map(nav => {
                        if(nav.isActiveRoute){
                        return (
                            <Nav.Link className='nav-link' href={`${nav.route}`} key={nav.id}>{nav.title}</Nav.Link>
                        )
                        }
                    })}
                    {(userID === '' || userID === undefined || userID === null) ? (
                        <li className="nav-item">
                            <Link to="/get-started" className="nav-link">Get Started</Link>
                        </li>
                    ) :  
                        <NavDropdown title={userData.userName} id="collapsible-nav-dropdown">
                            <NavDropdown.Item onClick={() => setISOpen(!isOpen)}>Cart</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => setWISOpen(!wISOpen)}>Wishlist</NavDropdown.Item>
                            <NavDropdown.Item href="/my-orders">Orders</NavDropdown.Item>
                            <NavDropdown.Item href="#" onClick={(e) => {
                                e.preventDefault();
                                handleLogout();
                            }}>
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    }
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </>
  )
}

export default Header