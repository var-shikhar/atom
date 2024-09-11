import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom';
import Footer from './component/footer';
import Header from './component/header';
import ContentRoute from './routes/routes';
import Preloader from './component/preloader';
import CookieModal from './component/cookieModal';
import ProductModal from './component/latestProduct';

const PreloaderWrapper = ({ loading, children }) => {
  const location = useLocation();

  if (location.pathname === '/' && loading) {
    return <Preloader />;
  }

  return children;
};

const App = () => {
  const {defaultRoutes} = ContentRoute();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const phoneNumber = '+917500104052';
    const message = 'Hello!';
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappURL, '_blank');
  };
  
  return (
    <Router>
      <PreloaderWrapper loading={loading}>
        <div className='vh-100 d-flex flex-column'>
          <Header />
          <Routes>
            {defaultRoutes !== null && defaultRoutes?.length > 0 && defaultRoutes.map(route => (
              <Route key={route.id} path={`/${route.route}`} element={route.element} />
            ))}
            <Route path='*' element={<Page404 />} />
          </Routes>
          <Footer />
          <CookieModal />
          <ProductModal />

          <div className="whatsapp-icon" onClick={handleWhatsAppClick}>
            <img
              alt="Atom"
              src={`${process.env.PUBLIC_URL}/whatsapp.png`}
              width="50"
              height="50"
              className="d-inline-block align-top"
              draggable={false}
            />
          </div>
        </div>
      </PreloaderWrapper>
    </Router>
  );
};

export default App;


const Page404 = () => {
  const navigate = useNavigate(); 
  return (
      <div className='d-flex align-items-center justify-content-center my-2 my-md-4 flex-column'>
          <div className=' my-2 my-md-4 fs-2'>404 - Page not found</div>
          <Button className='w-auto px-2 px-md-4 bg-dark border-dark' onClick={() => navigate('/')} type='button'>Proceed to Atom Page</Button>
      </div>
  )
}