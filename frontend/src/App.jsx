import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [search, setSearch] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [checkoutData, setCheckoutData] = useState({
    shippingAddress: {
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      phone: ''
    },
    paymentMethod: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    }
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}/orders`);
      const data = await response.json();
      setUserOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setShowCart(true);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getSubtotal = () => {
    return getTotalPrice();
  };

  const getShipping = () => {
    return getSubtotal() > 35 ? 0 : 5.99;
  };

  const getTax = () => {
    return getSubtotal() * 0.08; // 8% tax
  };

  const getTotal = () => {
    return getSubtotal() + getShipping() + getTax();
  };

  const handleAuth = async (endpoint) => {
    try {
      const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setShowLogin(false);
        setShowRegister(false);
        setFormData({ email: '', password: '', name: '' });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  const placeOrder = async () => {
    if (!user) {
      alert('Please login to place an order');
      return;
    }
    if (!checkoutData.shippingAddress.fullName || !checkoutData.paymentMethod.cardNumber) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          items: cart,
          total: getTotal(),
          shippingAddress: checkoutData.shippingAddress,
          paymentMethod: checkoutData.paymentMethod
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Order placed successfully! Your order number is: ' + data.order.id);
        setCart([]);
        setShowCart(false);
        setShowCheckout(false);
        fetchUserOrders();
      }
    } catch (error) {
      console.error('Order error:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                         product.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star filled' : 'star'}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="amazon-app">
      <header className="amazon-header">
        <div className="amazon-header-left">
          <span className="amazon-logo">ShopEase</span>
        </div>
        <div className="amazon-search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button>🔍</button>
        </div>
        <div className="amazon-header-right">
          {user ? (
            <div className="amazon-user-menu">
              <span>Hello, {user.name}</span>
              <div className="user-dropdown">
                <button onClick={() => setShowOrderHistory(!showOrderHistory)}>Your Orders</button>
                <button onClick={() => setUser(null)}>Sign Out</button>
              </div>
            </div>
          ) : (
            <div className="amazon-user-menu">
              <button onClick={() => setShowLogin(true)}>Sign In</button>
              <button onClick={() => setShowRegister(true)}>Register</button>
            </div>
          )}
          <div className="amazon-cart-icon" onClick={() => setShowCart(!showCart)}>
            🛒
            <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </div>
        </div>
      </header>

      <main className="amazon-main">
        <div className="amazon-sidebar">
          <h3>Categories</h3>
          <div className="category-list">
            <button 
              className={selectedCategory === 'All' ? 'active' : ''} 
              onClick={() => setSelectedCategory('All')}
            >
              All Categories
            </button>
            {categories.map(category => (
              <button 
                key={category} 
                className={selectedCategory === category ? 'active' : ''}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="amazon-products-grid">
          {filteredProducts.length === 0 && (
            <div className="no-products">No products found.</div>
          )}
          {filteredProducts.map(product => (
            <div key={product.id} className="amazon-product-card" onClick={() => setSelectedProduct(product)}>
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <div className="product-rating">
                {renderStars(product.rating)}
                <span className="review-count">({product.reviews})</span>
              </div>
              <p className="price">${product.price}</p>
              <p className="category">{product.category}</p>
              <button className="add-to-cart" onClick={e => { e.stopPropagation(); addToCart(product); }}>Add to Cart</button>
              <button className="buy-now" onClick={e => { e.stopPropagation(); addToCart(product); setShowCheckout(true); }}>Buy Now</button>
            </div>
          ))}
        </div>

        {showCart && (
          <div className="amazon-cart-sidebar">
            <h2>Shopping Cart</h2>
            {cart.length === 0 ? (
              <div className="empty-cart">Your cart is empty.</div>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} className="amazon-cart-item">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <h4>{item.name}</h4>
                      <p>${item.price}</p>
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                ))}
                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>{getShipping() === 0 ? 'FREE' : `$${getShipping().toFixed(2)}`}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax:</span>
                    <span>${getTax().toFixed(2)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                </div>
                <div className="cart-total">
                  <button className="checkout-btn" onClick={() => setShowCheckout(true)}>Proceed to Checkout</button>
                  <button className="close-cart" onClick={() => setShowCart(false)}>Close</button>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {selectedProduct && (
        <div className="modal" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content product-details-modal" onClick={e => e.stopPropagation()}>
            <img src={selectedProduct.image} alt={selectedProduct.name} className="details-image" />
            <h2>{selectedProduct.name}</h2>
            <div className="product-rating">
              {renderStars(selectedProduct.rating)}
              <span className="review-count">({selectedProduct.reviews} reviews)</span>
            </div>
            <p className="price">${selectedProduct.price}</p>
            <p className="category">Category: {selectedProduct.category}</p>
            <p className="description">{selectedProduct.description}</p>
            <div className="details-actions">
              <button className="add-to-cart" onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}>Add to Cart</button>
              <button className="buy-now" onClick={() => { addToCart(selectedProduct); setShowCheckout(true); setSelectedProduct(null); }}>Buy Now</button>
              <button className="close-cart" onClick={() => setSelectedProduct(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showCheckout && (
        <div className="modal">
          <div className="modal-content checkout-modal">
            <h2>Checkout</h2>
            <div className="checkout-sections">
              <div className="shipping-section">
                <h3>Shipping Address</h3>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={checkoutData.shippingAddress.fullName}
                  onChange={(e) => setCheckoutData({
                    ...checkoutData,
                    shippingAddress: { ...checkoutData.shippingAddress, fullName: e.target.value }
                  })}
                />
                <input
                  type="text"
                  placeholder="Address Line 1"
                  value={checkoutData.shippingAddress.addressLine1}
                  onChange={(e) => setCheckoutData({
                    ...checkoutData,
                    shippingAddress: { ...checkoutData.shippingAddress, addressLine1: e.target.value }
                  })}
                />
                <input
                  type="text"
                  placeholder="Address Line 2 (Optional)"
                  value={checkoutData.shippingAddress.addressLine2}
                  onChange={(e) => setCheckoutData({
                    ...checkoutData,
                    shippingAddress: { ...checkoutData.shippingAddress, addressLine2: e.target.value }
                  })}
                />
                <div className="city-state-zip">
                  <input
                    type="text"
                    placeholder="City"
                    value={checkoutData.shippingAddress.city}
                    onChange={(e) => setCheckoutData({
                      ...checkoutData,
                      shippingAddress: { ...checkoutData.shippingAddress, city: e.target.value }
                    })}
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={checkoutData.shippingAddress.state}
                    onChange={(e) => setCheckoutData({
                      ...checkoutData,
                      shippingAddress: { ...checkoutData.shippingAddress, state: e.target.value }
                    })}
                  />
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={checkoutData.shippingAddress.zipCode}
                    onChange={(e) => setCheckoutData({
                      ...checkoutData,
                      shippingAddress: { ...checkoutData.shippingAddress, zipCode: e.target.value }
                    })}
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={checkoutData.shippingAddress.phone}
                  onChange={(e) => setCheckoutData({
                    ...checkoutData,
                    shippingAddress: { ...checkoutData.shippingAddress, phone: e.target.value }
                  })}
                />
              </div>

              <div className="payment-section">
                <h3>Payment Method</h3>
                <input
                  type="text"
                  placeholder="Card Number"
                  value={checkoutData.paymentMethod.cardNumber}
                  onChange={(e) => setCheckoutData({
                    ...checkoutData,
                    paymentMethod: { ...checkoutData.paymentMethod, cardNumber: e.target.value }
                  })}
                />
                <div className="card-details">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={checkoutData.paymentMethod.expiryDate}
                    onChange={(e) => setCheckoutData({
                      ...checkoutData,
                      paymentMethod: { ...checkoutData.paymentMethod, expiryDate: e.target.value }
                    })}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={checkoutData.paymentMethod.cvv}
                    onChange={(e) => setCheckoutData({
                      ...checkoutData,
                      paymentMethod: { ...checkoutData.paymentMethod, cvv: e.target.value }
                    })}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  value={checkoutData.paymentMethod.cardholderName}
                  onChange={(e) => setCheckoutData({
                    ...checkoutData,
                    paymentMethod: { ...checkoutData.paymentMethod, cardholderName: e.target.value }
                  })}
                />
              </div>

              <div className="order-summary">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>{getShipping() === 0 ? 'FREE' : `$${getShipping().toFixed(2)}`}</span>
                </div>
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>${getTax().toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="checkout-actions">
              <button className="place-order-btn" onClick={placeOrder}>Place Order</button>
              <button className="cancel-btn" onClick={() => setShowCheckout(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showOrderHistory && user && (
        <div className="modal">
          <div className="modal-content order-history-modal">
            <h2>Your Orders</h2>
            {userOrders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <div className="orders-list">
                {userOrders.map(order => (
                  <div key={order.id} className="order-item">
                    <div className="order-header">
                      <h4>Order #{order.id}</h4>
                      <span className="order-status">{order.status}</span>
                    </div>
                    <div className="order-date">
                      Ordered on: {new Date(order.orderDate).toLocaleDateString()}
                    </div>
                    <div className="order-total">
                      Total: ${order.total.toFixed(2)}
                    </div>
                    <div className="order-tracking">
                      Tracking: {order.trackingNumber}
                    </div>
                    <div className="order-items">
                      {order.items.map(item => (
                        <div key={item.id} className="order-item-detail">
                          <img src={item.image} alt={item.name} />
                          <span>{item.name} x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button className="close-btn" onClick={() => setShowOrderHistory(false)}>Close</button>
          </div>
        </div>
      )}

      {(showLogin || showRegister) && (
        <div className="modal">
          <div className="modal-content">
            <h2>{showLogin ? 'Sign In' : 'Register'}</h2>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            {showRegister && (
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            )}
            <button onClick={() => handleAuth(showLogin ? 'login' : 'register')}>
              {showLogin ? 'Sign In' : 'Register'}
            </button>
            <button onClick={() => {
              setShowLogin(false);
              setShowRegister(false);
              setFormData({ email: '', password: '', name: '' });
            }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
