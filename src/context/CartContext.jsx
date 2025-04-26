import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  function addToCart(product) {
    setCartItems(prev => {
      const existing = prev.find(p => p.id === product.id)
      if (existing) {
        return prev.map(p =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  function clearCart() {
    setCartItems([])
  }

  const totalCount = cartItems.reduce((sum, p) => sum + p.quantity, 0)
  const totalPrice = cartItems.reduce((sum, p) => sum + p.quantity * p.price, 0)

  return (
    <CartContext.Provider value={{ cartItems, addToCart, clearCart, totalCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
