import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import ProductGrid from './components/ProductGrid';
import CartView from './components/CartView';
import WishlistView from './components/WishlistView';

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <CartProvider>
      <WishlistProvider>
        <Navbar
          onCartClick={() => setCartOpen(true)}
          onWishlistClick={() => setWishlistOpen(true)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <ProductGrid searchTerm={searchTerm} />

        {cartOpen && <CartView onClose={() => setCartOpen(false)} />}
        {wishlistOpen && <WishlistView onClose={() => setWishlistOpen(false)} />}
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
