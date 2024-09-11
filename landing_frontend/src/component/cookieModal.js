import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const CookieModal = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');    
    if (!cookieConsent) {
      setShowModal(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowModal(false);
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="cookie-modal">
      <div className="d-flex align-items-center justify-content-between px-3">
        <div>We use cookies to improve your experience on our site. By using our site, you consent to cookies.</div>
        <Button type='button' onClick={handleAccept}>Accept</Button>
      </div>
    </div>
  );
};

export default CookieModal;
