import { useWishlist } from '../context/WishlistContext';

export default function WishlistView({ onClose }) {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20">
      <div className="bg-white w-full max-w-lg p-6 rounded shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">Your Wishlist</h2>
        {wishlistItems.length === 0 ? (
          <p className="text-center">No items in your wishlist.</p>
        ) : (
          <ul className="space-y-4 max-h-96 overflow-y-auto">
            {wishlistItems.map(item => (
              <li key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-600">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
