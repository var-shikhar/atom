import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [isOpen, setISOpen] = useState(false);

    return (
        <CartContext.Provider value={{ isOpen, setISOpen }}>
            {children}
        </CartContext.Provider>
    );
};
