import { FaShoppingCart, FaSearch, FaHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar({
  onCartClick,
  onWishlistClick,
  searchTerm,
  onSearchChange,
}) {
  const { totalCount } = useCart();
  const { totalWishlist } = useWishlist();

  return (
    <nav className="bg-white shadow px-4 py-2 flex items-center justify-between">
      {/* Brand */}
      <span className="text-xl font-bold">E-Commerce App</span>

      {/* Right Side: Search, Wishlist, Cart */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative w-64">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-1 border rounded-full focus:outline-none focus:ring"
          />
        </div>

        {/* Wishlist Icon */}
        <button
          className="relative focus:outline-none"
          onClick={onWishlistClick}
          aria-label="View wishlist"
        >
          <FaHeart size={24} className="text-pink-500" />
          {totalWishlist > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {totalWishlist}
            </span>
          )}
        </button>

        {/* Cart Icon */}
        <button
          className="relative focus:outline-none"
          onClick={onCartClick}
          aria-label="View cart"
        >
          <FaShoppingCart size={24} />
          {totalCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {totalCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
