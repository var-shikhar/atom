import React, { createContext, useContext, useState } from 'react';

const WishListContext = createContext();

export const useWishList = () => useContext(WishListContext);

export const WishListProvider = ({ children }) => {
    const [wISOpen, setWISOpen] = useState(false);

    return (
        <WishListContext.Provider value={{ wISOpen, setWISOpen }}>
            {children}
        </WishListContext.Provider>
    );
};
