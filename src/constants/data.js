export const CATEGORIES = [
  { id: '1', title: 'Sneakers', icon: '👟' },
  { id: '2', title: 'Clothing', icon: '👕' },
  { id: '3', title: 'Phones', icon: '📱' },
  { id: '4', title: 'Watches', icon: '⌚' },
  { id: '5', title: 'Sports', icon: '⚽' },
  { id: '6', title: 'Gaming', icon: '🎮' },
];

export const PRODUCTS = [
  { 
    id: '1', 
    title: 'Nike Air Max', 
    price: 120.00, 
    description: 'Premium athletic shoes designed for maximum comfort and style.',
    categoryId: '1' // Matches "Sneakers"
  },
  { 
    id: '2', 
    title: 'Minimal Watch', 
    price: 85.00, 
    description: 'A sleek, modern timepiece perfect for everyday wear.',
    categoryId: '4' // Matches "Watches"
  },
  { 
    id: '3', 
    title: 'Cotton T-Shirt', 
    price: 25.00, 
    description: 'Classic fit, 100% organic cotton t-shirt.',
    categoryId: '2' // Matches "Clothing"
  },
  { 
    id: '4', 
    title: 'Wireless Audio', 
    price: 199.00, 
    description: 'High-fidelity noise-cancelling over-ear headphones.',
    categoryId: '3' // Matches "Phones/Tech"
  },
];