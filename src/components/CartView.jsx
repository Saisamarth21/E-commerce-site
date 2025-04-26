import { useCart } from '../context/CartContext'

export default function CartView({ onClose }) {
  const { cartItems, totalPrice, clearCart } = useCart()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20">
      <div className="bg-white w-full max-w-lg p-6 rounded shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        {cartItems.length === 0 ? (
          <p className="text-center">Your cart is empty.</p>
        ) : (
          <>
            <ul className="space-y-4 max-h-96 overflow-y-auto">
              {cartItems.map(item => (
                <li key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-bold">${(item.quantity * item.price).toFixed(2)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t pt-4 flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold">${totalPrice.toFixed(2)}</span>
            </div>
            <button
              className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </>
        )}
      </div>
    </div>
  )
}
