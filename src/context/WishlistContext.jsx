import { createContext, useContext, useState } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);

  function addToWishlist(product) {
    setWishlistItems(prev => {
      // only add if not already present
      if (prev.find(p => p.id === product.id)) return prev;
      return [...prev, { ...product }];
    });
  }

  function removeFromWishlist(productId) {
    setWishlistItems(prev => prev.filter(p => p.id !== productId));
  }

  const totalWishlist = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, addToWishlist, removeFromWishlist, totalWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
