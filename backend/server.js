const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data - Amazon-like products
let products = [
  // Electronics
  { id: 1, name: 'iPhone 15 Pro', price: 999, category: 'Electronics', image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-model-unselect-gallery-1-202309?wid=512&hei=512&fmt=jpeg&qlt=95&.v=1692912410452', description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system.', rating: 4.8, reviews: 1247, inStock: true },
  { id: 2, name: 'MacBook Pro 14"', price: 1999, category: 'Electronics', image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp14-silver-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311047897', description: 'Powerful laptop with M3 chip, perfect for professionals and creatives.', rating: 4.9, reviews: 892, inStock: true },
  { id: 3, name: 'Samsung 4K Smart TV', price: 799, category: 'Electronics', image: 'https://images.samsung.com/is/image/samsung/p6pim/in/ua55au7700klxl/gallery/in-crystaluhd-au7700-ua55au7700klxl-530347991?$650_519_PNG$', description: '55-inch 4K Ultra HD Smart TV with Crystal Display and Alexa built-in.', rating: 4.6, reviews: 2156, inStock: true },
  { id: 4, name: 'Sony WH-1000XM5', price: 349, category: 'Electronics', image: 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg', description: 'Industry-leading noise canceling wireless headphones with 30-hour battery.', rating: 4.7, reviews: 3421, inStock: true },
  { id: 5, name: 'iPad Air', price: 599, category: 'Electronics', image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-air-model-unselect-gallery-2-202203?wid=512&hei=512&fmt=jpeg&qlt=95&.v=1645066729192', description: 'Powerful tablet with M1 chip, perfect for work and entertainment.', rating: 4.8, reviews: 1567, inStock: true },

  // Fashion
  { id: 6, name: 'Nike Air Max 270', price: 150, category: 'Fashion', image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/6b7e2e2d-2e2e-4e2e-8e2e-2e2e2e2e2e2e/air-max-270-mens-shoes-KkLcGR.png', description: 'Comfortable running shoes with Air Max technology for maximum cushioning.', rating: 4.5, reviews: 2891, inStock: true },
  { id: 7, name: "Levi's 501 Jeans", price: 89, category: 'Fashion', image: 'https://lsco.scene7.com/is/image/lsco/005010114-front-pdp', description: 'Classic straight fit jeans in authentic denim with button fly.', rating: 4.4, reviews: 1876, inStock: true },
  { id: 8, name: 'Adidas Ultraboost', price: 180, category: 'Fashion', image: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/7e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e_9366/Ultraboost_21_Shoes_White_FY0377_01_standard.jpg', description: 'Premium running shoes with responsive Boost midsole technology.', rating: 4.6, reviews: 2341, inStock: true },
  { id: 9, name: 'Ray-Ban Aviator', price: 154, category: 'Fashion', image: 'https://assets.ray-ban.com/is/image/RayBan/805289602057__STD__shad__fr.png', description: 'Iconic aviator sunglasses with gold frame and green lenses.', rating: 4.7, reviews: 987, inStock: true },
  { id: 10, name: 'Casio G-Shock', price: 99, category: 'Fashion', image: 'https://www.casio.com/content/dam/casio/product-info/locales/intl/en/timepiece/product/watch/G/GD/gd350-1b/assets/GD-350-1B_Seq1.png.transform/main-visual-pc/image.png', description: 'Durable digital watch with shock resistance and multiple functions.', rating: 4.5, reviews: 1456, inStock: true },

  // Home & Kitchen
  { id: 11, name: 'Instant Pot Duo', price: 89, category: 'Home', image: 'https://m.media-amazon.com/images/I/71VbHaAqbML._AC_SL1500_.jpg', description: '7-in-1 electric pressure cooker with 10 safety features.', rating: 4.8, reviews: 4567, inStock: true },
  { id: 12, name: 'Dyson V15 Detect', price: 699, category: 'Home', image: 'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/447029-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920&hei=1920', description: 'Cordless vacuum with laser dust detection and 60-minute runtime.', rating: 4.9, reviews: 2341, inStock: true },
  { id: 13, name: 'Ninja Foodi', price: 199, category: 'Home', image: 'https://m.media-amazon.com/images/I/81y5F7QFJIL._AC_SL1500_.jpg', description: '9-in-1 Deluxe XL Cooker with TenderCrisp technology.', rating: 4.7, reviews: 3124, inStock: true },
  { id: 14, name: 'Philips Hue Starter Kit', price: 199, category: 'Home', image: 'https://images.philips.com/is/image/PhilipsConsumer/046677555556-A1P-global-001?wid=420&hei=360&$jpglarge$', description: 'Smart lighting starter kit with 3 bulbs and bridge for home automation.', rating: 4.6, reviews: 1876, inStock: true },
  { id: 15, name: 'KitchenAid Stand Mixer', price: 379, category: 'Home', image: 'https://m.media-amazon.com/images/I/81Vw5Zl2HGL._AC_SL1500_.jpg', description: 'Professional 5-quart stand mixer with 10-speed motor.', rating: 4.8, reviews: 2987, inStock: true },

  // Books
  { id: 16, name: 'The Seven Husbands of Evelyn Hugo', price: 16, category: 'Books', image: 'https://m.media-amazon.com/images/I/81r+LNwq2PL._AC_UF1000,1000_QL80_.jpg', description: 'Bestselling novel by Taylor Jenkins Reid about Hollywood glamour and secrets.', rating: 4.6, reviews: 89234, inStock: true },
  { id: 17, name: 'Atomic Habits', price: 23, category: 'Books', image: 'https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UF1000,1000_QL80_.jpg', description: 'Transform your life with tiny changes in behavior by James Clear.', rating: 4.8, reviews: 124567, inStock: true },
  { id: 18, name: 'The Midnight Library', price: 18, category: 'Books', image: 'https://m.media-amazon.com/images/I/81eA+Q5Q5QL._AC_UF1000,1000_QL80_.jpg', description: 'Matt Haig\'s novel about infinite possibilities and second chances.', rating: 4.5, reviews: 67890, inStock: true },
  { id: 19, name: 'Project Hail Mary', price: 25, category: 'Books', image: 'https://m.media-amazon.com/images/I/91z0t4Q5Q5L._AC_UF1000,1000_QL80_.jpg', description: 'Andy Weir\'s space adventure about survival and friendship.', rating: 4.7, reviews: 45678, inStock: true },
  { id: 20, name: 'Verity', price: 19, category: 'Books', image: 'https://m.media-amazon.com/images/I/81r+LNwq2PL._AC_UF1000,1000_QL80_.jpg', description: 'Psychological thriller by Colleen Hoover with shocking twists.', rating: 4.4, reviews: 78901, inStock: true },

  // Sports & Outdoors
  { id: 21, name: 'Yeti Rambler Tumbler', price: 35, category: 'Sports', image: 'https://m.media-amazon.com/images/I/61k5Q5Q5Q5L._AC_SL1500_.jpg', description: '20oz insulated tumbler keeps drinks cold for hours.', rating: 4.8, reviews: 12345, inStock: true },
  { id: 22, name: 'GoPro Hero 11', price: 399, category: 'Sports', image: 'https://gopro.com/content/dam/gopro/en/apex/products/hero11-black/gallery/hero11-black-gallery-1.png', description: 'Action camera with 5.3K video and HyperSmooth 5.0 stabilization.', rating: 4.7, reviews: 5678, inStock: true },
  { id: 23, name: 'Fitbit Charge 5', price: 149, category: 'Sports', image: 'https://m.media-amazon.com/images/I/61l5Q5Q5Q5L._AC_SL1500_.jpg', description: 'Advanced fitness tracker with heart rate monitoring and GPS.', rating: 4.5, reviews: 8901, inStock: true },
  { id: 24, name: 'Coleman Sundome Tent', price: 89, category: 'Sports', image: 'https://m.media-amazon.com/images/I/81Q5Q5Q5Q5L._AC_SL1500_.jpg', description: '4-person camping tent with weather protection and easy setup.', rating: 4.6, reviews: 3456, inStock: true },
  { id: 25, name: 'Hydro Flask Water Bottle', price: 44, category: 'Sports', image: 'https://m.media-amazon.com/images/I/71y5Q5Q5Q5L._AC_SL1500_.jpg', description: '32oz insulated water bottle keeps drinks cold for 24 hours.', rating: 4.7, reviews: 6789, inStock: true },

  // Toys & Games
  { id: 26, name: 'LEGO Star Wars Millennium Falcon', price: 159, category: 'Toys', image: 'https://m.media-amazon.com/images/I/81eA+Q5Q5QL._AC_SL1500_.jpg', description: 'Iconic Star Wars ship with 1,329 pieces for ages 9+.', rating: 4.9, reviews: 2345, inStock: true },
  { id: 27, name: 'Nintendo Switch OLED', price: 349, category: 'Toys', image: 'https://m.media-amazon.com/images/I/61-PblYntsL._AC_SL1500_.jpg', description: 'Gaming console with 7-inch OLED screen and enhanced audio.', rating: 4.8, reviews: 4567, inStock: true },
  { id: 28, name: 'PlayStation 5', price: 499, category: 'Toys', image: 'https://m.media-amazon.com/images/I/61nPiOO2wPL._AC_SL1500_.jpg', description: 'Next-gen gaming console with lightning-fast loading and ray tracing.', rating: 4.9, reviews: 7890, inStock: true },
  { id: 29, name: 'Catan Board Game', price: 45, category: 'Toys', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Catan-2015-game.jpg', description: 'Strategy board game for 3-4 players, perfect for family game night.', rating: 4.7, reviews: 1234, inStock: true },
  { id: 30, name: 'Hot Wheels Ultimate Garage', price: 89, category: 'Toys', image: 'https://m.media-amazon.com/images/I/81Q5Q5Q5Q5L._AC_SL1500_.jpg', description: 'Multi-level car garage playset with 5 cars and interactive features.', rating: 4.6, reviews: 567, inStock: true },
];

let users = [];
let orders = [];
let addresses = [];

// Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

app.get('/api/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json(categories);
});

app.post('/api/register', (req, res) => {
  const { email, password, name } = req.body;
  const existingUser = users.find(u => u.email === email);
  if (existingUser) return res.status(400).json({ message: 'User already exists' });
  
  const user = { 
    id: users.length + 1, 
    email, 
    password, 
    name,
    createdAt: new Date(),
    addresses: []
  };
  users.push(user);
  res.json({ message: 'User registered successfully', user: { id: user.id, email, name } });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ message: 'Login successful', user: { id: user.id, email, name: user.name } });
});

app.post('/api/addresses', (req, res) => {
  const { userId, address } = req.body;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  
  const newAddress = {
    id: addresses.length + 1,
    userId,
    ...address,
    isDefault: user.addresses.length === 0
  };
  addresses.push(newAddress);
  user.addresses.push(newAddress.id);
  
  res.json({ message: 'Address added successfully', address: newAddress });
});

app.get('/api/users/:userId/addresses', (req, res) => {
  const userAddresses = addresses.filter(a => a.userId === parseInt(req.params.userId));
  res.json(userAddresses);
});

app.post('/api/orders', (req, res) => {
  const { userId, items, total, shippingAddress, paymentMethod } = req.body;
  
  const order = {
    id: orders.length + 1,
    userId,
    items,
    total,
    shippingAddress,
    paymentMethod,
    status: 'Processing',
    orderDate: new Date(),
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    trackingNumber: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  };
  orders.push(order);
  res.json({ message: 'Order placed successfully', order });
});

app.get('/api/users/:userId/orders', (req, res) => {
  const userOrders = orders.filter(o => o.userId === parseInt(req.params.userId));
  res.json(userOrders);
});

app.get('/api/orders/:orderId', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.orderId));
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

app.put('/api/orders/:orderId/status', (req, res) => {
  const { status } = req.body;
  const order = orders.find(o => o.id === parseInt(req.params.orderId));
  if (!order) return res.status(404).json({ message: 'Order not found' });
  
  order.status = status;
  res.json({ message: 'Order status updated', order });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 