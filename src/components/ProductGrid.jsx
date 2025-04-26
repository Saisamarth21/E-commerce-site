// src/components/ProductGrid.jsx
import { useEffect, useState, useRef, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { FaRegHeart, FaHeart, FaFilter } from 'react-icons/fa';

export default function ProductGrid({ searchTerm }) {
  const LIMIT = 12;

  const [allProducts, setAllProducts]   = useState([]);
  const [total, setTotal]               = useState(null);
  const [skip, setSkip]                 = useState(0);
  const [hasMore, setHasMore]           = useState(true);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [filterOpen, setFilterOpen]     = useState(false);
  const [filterOption, setFilterOption] = useState(null);

  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();

  const filterRef = useRef();
  const observer  = useRef();

  // Load one “page” of products
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await fetch(
        `https://dummyjson.com/products?limit=${LIMIT}&skip=${skip}`
      );
      if (!res.ok) throw new Error('Network response was not ok');

      const json = await res.json();
      const newProds = json.products;
      // Store total count on first fetch
      if (total === null) setTotal(json.total);

      // Append and decide if there’s more
      setAllProducts(prev => {
        const combined = [...prev, ...newProds];
        if (combined.length >= json.total) {
          setHasMore(false);
        }
        return combined;
      });

      setSkip(s => s + LIMIT);
    } catch (err) {
      console.error(err);
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  }, [skip, loading, hasMore, total]);

  // Initial load
  useEffect(() => {
    loadMore();
  }, []);

  // Close filters when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // IntersectionObserver for infinite scroll
  const sentinelRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMore]);

  if (error) {
    return <p className="text-center mt-8 text-red-500">{error}</p>;
  }

  // 1) search‐filter
  const filtered = allProducts.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2) sort‐filter
  const sorted = [...filtered].sort((a, b) => {
    switch (filterOption) {
      case 'price-htl': return b.price - a.price;
      case 'price-lth': return a.price - b.price;
      case 'rating-htl': return b.rating - a.rating;
      case 'rating-lth': return a.rating - b.rating;
      default: return 0;
    }
  });

  const isWishlisted = id => wishlistItems.some(p => p.id === id);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setFilterOpen(o => !o)}
            className="flex items-center px-3 py-1 border rounded hover:bg-gray-100 focus:outline-none"
          >
            <FaFilter className="mr-2" /> Filters
          </button>
          {filterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
              <button
                onClick={() => { setFilterOption('price-htl'); setFilterOpen(false); }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Price: High → Low
              </button>
              <button
                onClick={() => { setFilterOption('price-lth'); setFilterOpen(false); }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Price: Low → High
              </button>
              <button
                onClick={() => { setFilterOption('rating-htl'); setFilterOpen(false); }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Rating: High → Low
              </button>
              <button
                onClick={() => { setFilterOption('rating-lth'); setFilterOpen(false); }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Rating: Low → High
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sorted.map(p => (
          <div
            key={p.id}
            className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition flex flex-col"
          >
            <img
              src={p.thumbnail}
              alt={p.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-semibold text-lg">{p.title}</h2>
                <button
                  onClick={() =>
                    isWishlisted(p.id)
                      ? removeFromWishlist(p.id)
                      : addToWishlist(p)
                  }
                  className="focus:outline-none"
                >
                  {isWishlisted(p.id)
                    ? <FaHeart className="text-pink-500" />
                    : <FaRegHeart className="text-gray-400" />}
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {p.description}
              </p>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">${p.price.toFixed(2)}</span>
                <span className="text-sm text-yellow-600">{p.rating} ★</span>
              </div>
              <button
                onClick={() => addToCart(p)}
                className="mt-auto bg-blue-500 text-white py-1 rounded hover:bg-blue-600 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sentinel & Loading Indicator */}
      <div ref={sentinelRef} className="h-4">
        {loading && <p className="text-center mt-4">Loading more…</p>}
        {!hasMore && <p className="text-center mt-4 text-gray-500">No more products.</p>}
      </div>
    </div>
  );
}
