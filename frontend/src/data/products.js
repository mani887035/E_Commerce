// Static product data — used as fallback when backend is unavailable
// All prices in Indian Rupees (₹)
const BASE = '';

export const staticProducts = [
  // ─── ELECTRONICS (7 products) ───
  {
    _id: 'elec001',
    name: 'Apple MacBook Pro 16"',
    description: 'The most powerful MacBook Pro ever with M3 Max chip, stunning Liquid Retina XDR display, up to 22 hours of battery life, and professional-grade performance for creators.',
    price: 349900, originalPrice: 399900,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format'],
    category: 'Electronics', brand: 'Apple', stock: 15, rating: 4.8, numReviews: 124,
    isFeatured: true, tags: ['laptop', 'apple', 'macbook', 'premium'], reviews: [],
  },
  {
    _id: 'elec002',
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancellation with 8 microphones and AI-powered processing. 30-hour battery life and ultra-comfortable premium design for all-day wear.',
    price: 34990, originalPrice: 39990,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format'],
    category: 'Electronics', brand: 'Sony', stock: 30, rating: 4.9, numReviews: 287,
    isFeatured: true, tags: ['headphones', 'audio', 'wireless'], reviews: [],
  },
  {
    _id: 'elec003',
    name: 'iPhone 15 Pro Max',
    description: 'Aerospace-grade titanium design, A17 Pro chip, 48MP main camera with 5x optical zoom, and Action Button for instant control.',
    price: 159900, originalPrice: 174900,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format',
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format'],
    category: 'Electronics', brand: 'Apple', stock: 25, rating: 4.9, numReviews: 542,
    isFeatured: true, tags: ['phone', 'apple', 'iphone'], reviews: [],
  },
  {
    _id: 'elec004',
    name: 'Samsung 4K OLED TV 55"',
    description: 'Breathtaking 4K OLED with vibrant self-lit pixels, infinite contrast, Dolby Atmos audio, and Smart TV built-in streaming.',
    price: 140000, originalPrice: 165000,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600&auto=format',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600&auto=format'],
    category: 'Electronics', brand: 'Samsung', stock: 8, rating: 4.7, numReviews: 89,
    isFeatured: false, tags: ['tv', 'oled', '4k'], reviews: [],
  },
  {
    _id: 'elec005',
    name: 'Samsung Galaxy Watch Ultra',
    description: 'Premium smartwatch with titanium case, advanced health monitoring, GPS tracking, 48-hour battery, and 100m water resistance.',
    price: 59999, originalPrice: 69999,
    image: `${BASE}/images/galaxy_watch.png`,
    images: [`${BASE}/images/galaxy_watch.png`],
    category: 'Electronics', brand: 'Samsung', stock: 20, rating: 4.6, numReviews: 114,
    isFeatured: true, tags: ['smartwatch', 'samsung', 'fitness'], reviews: [],
  },
  {
    _id: 'elec006',
    name: 'Canon EOS R6 Mark II',
    description: 'Professional mirrorless camera with 40fps burst shooting, 6K RAW video, and AI-powered subject-detection autofocus.',
    price: 259990, originalPrice: 289990,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format'],
    category: 'Electronics', brand: 'Canon', stock: 12, rating: 4.8, numReviews: 56,
    isFeatured: false, tags: ['camera', 'mirrorless'], reviews: [],
  },
  {
    _id: 'elec007',
    name: 'DJI Mini 4 Pro Drone',
    description: 'Compact foldable drone under 249g with 4K/60fps HDR video, 48MP photos, omnidirectional obstacle sensing, 34-minute flight time.',
    price: 82000, originalPrice: 95000,
    image: `${BASE}/images/dji_drone.png`,
    images: [`${BASE}/images/dji_drone.png`],
    category: 'Electronics', brand: 'DJI', stock: 14, rating: 4.8, numReviews: 203,
    isFeatured: true, tags: ['drone', 'dji', '4k'], reviews: [],
  },

  // ─── FASHION (6 products) ───
  {
    _id: 'fash001',
    name: 'Nike Air Max 270',
    description: 'Bold sneakers featuring the largest Air unit ever in Nike footwear. Engineered mesh upper for breathability and all-day cushioning.',
    price: 14995, originalPrice: 17995,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format'],
    category: 'Fashion', brand: 'Nike', stock: 50, rating: 4.6, numReviews: 198,
    isFeatured: true, tags: ['shoes', 'nike', 'sports'], reviews: [],
  },
  {
    _id: 'fash002',
    name: 'Adidas Ultraboost 23',
    description: 'Energy-returning running shoes powered by BOOST midsole technology. Continental rubber outsole for superior grip.',
    price: 16999, originalPrice: 19999,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format',
    images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format'],
    category: 'Fashion', brand: 'Adidas', stock: 40, rating: 4.5, numReviews: 312,
    isFeatured: false, tags: ['shoes', 'running', 'adidas'], reviews: [],
  },
  {
    _id: 'fash003',
    name: 'Rolex Submariner Watch',
    description: 'Iconic luxury dive watch in Oystersteel with blue dial. Water-resistant to 300m. An investment in timeless elegance.',
    price: 950000, originalPrice: 950000,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format'],
    category: 'Fashion', brand: 'Rolex', stock: 3, rating: 5.0, numReviews: 29,
    isFeatured: true, tags: ['watch', 'luxury', 'rolex'], reviews: [],
  },
  {
    _id: 'fash004',
    name: 'Ray-Ban Aviator Classic',
    description: 'Timeless Aviators with gold metal frame and G-15 green lenses. Crystal lenses with 100% UV protection.',
    price: 9490, originalPrice: 11490,
    image: `${BASE}/images/rayban_sunglasses.png`,
    images: [`${BASE}/images/rayban_sunglasses.png`],
    category: 'Fashion', brand: 'Ray-Ban', stock: 35, rating: 4.7, numReviews: 445,
    isFeatured: true, tags: ['sunglasses', 'rayban', 'eyewear'], reviews: [],
  },
  {
    _id: 'fash005',
    name: 'Premium Leather Messenger Bag',
    description: 'Handcrafted full-grain leather messenger bag with brass hardware. Fits 15" laptop, multiple pockets, adjustable strap.',
    price: 24999, originalPrice: 34999,
    image: `${BASE}/images/leather_bag.png`,
    images: [`${BASE}/images/leather_bag.png`],
    category: 'Fashion', brand: 'Bellroy', stock: 18, rating: 4.8, numReviews: 167,
    isFeatured: false, tags: ['bag', 'leather', 'accessories'], reviews: [],
  },
  {
    _id: 'fash006',
    name: 'Luxury Designer Sneakers',
    description: 'Italian-crafted premium leather sneakers with gold accent stitching. Hand-finished for a truly elevated look.',
    price: 39999, originalPrice: 49999,
    image: `${BASE}/images/luxury_sneakers.png`,
    images: [`${BASE}/images/luxury_sneakers.png`],
    category: 'Fashion', brand: 'Golden Goose', stock: 12, rating: 4.6, numReviews: 89,
    isFeatured: false, tags: ['sneakers', 'luxury', 'designer'], reviews: [],
  },

  // ─── HOME & GARDEN (6 products) ───
  {
    _id: 'home001',
    name: 'Dyson V15 Detect Vacuum',
    description: 'Laser-guided intelligent vacuum that reveals microscopic dust. Twice the suction with HEPA whole-machine filtration.',
    price: 62900, originalPrice: 72900,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format'],
    category: 'Home & Garden', brand: 'Dyson', stock: 20, rating: 4.7, numReviews: 143,
    isFeatured: false, tags: ['vacuum', 'dyson', 'cleaning'], reviews: [],
  },
  {
    _id: 'home002',
    name: 'KitchenAid Artisan Stand Mixer',
    description: 'Professional-grade stand mixer with 10 speeds, 5-quart bowl, tilt-head design, and 59 available attachments.',
    price: 53675, originalPrice: 62500,
    image: 'https://images.unsplash.com/photo-1578374173705-969cbe6f2d6b?w=600&auto=format',
    images: ['https://images.unsplash.com/photo-1578374173705-969cbe6f2d6b?w=600&auto=format'],
    category: 'Home & Garden', brand: 'KitchenAid', stock: 22, rating: 4.8, numReviews: 231,
    isFeatured: true, tags: ['kitchen', 'mixer', 'baking'], reviews: [],
  },
  {
    _id: 'home003',
    name: 'Nespresso Vertuo Next Coffee Machine',
    description: 'One-touch coffee machine with Centrifusion technology. Compatible with 30+ varieties. Imported premium coffee experience.',
    price: 47000, originalPrice: 55000,
    image: `${BASE}/images/nespresso_machine.png`,
    images: [`${BASE}/images/nespresso_machine.png`],
    category: 'Home & Garden', brand: 'Nespresso', stock: 28, rating: 4.6, numReviews: 378,
    isFeatured: true, tags: ['coffee', 'nespresso', 'kitchen'], reviews: [],
  },
  {
    _id: 'home004',
    name: 'Dyson Pure Cool Air Purifier',
    description: 'Tower air purifier with HEPA and activated carbon filtration. Captures 99.95% of fine particles including allergens.',
    price: 54900, originalPrice: 64900,
    image: `${BASE}/images/air_purifier.png`,
    images: [`${BASE}/images/air_purifier.png`],
    category: 'Home & Garden', brand: 'Dyson', stock: 16, rating: 4.7, numReviews: 192,
    isFeatured: false, tags: ['air purifier', 'dyson', 'health'], reviews: [],
  },
  {
    _id: 'home005',
    name: 'Smart LED Arc Floor Lamp',
    description: 'WiFi-enabled smart floor lamp with adjustable color temperature, 16M colors, and voice control for Alexa & Google Home.',
    price: 11999, originalPrice: 15999,
    image: `${BASE}/images/smart_lamp.png`,
    images: [`${BASE}/images/smart_lamp.png`],
    category: 'Home & Garden', brand: 'Govee', stock: 33, rating: 4.5, numReviews: 267,
    isFeatured: false, tags: ['lamp', 'smart home', 'led'], reviews: [],
  },
  {
    _id: 'home006',
    name: 'Indoor Plant Collection Set',
    description: 'Three air-purifying plants — Monstera, Golden Pothos, and Succulent — each in a handmade ceramic pot. Perfect gift.',
    price: 2499, originalPrice: 3499,
    image: `${BASE}/images/indoor_plants.png`,
    images: [`${BASE}/images/indoor_plants.png`],
    category: 'Home & Garden', brand: 'The Sill', stock: 25, rating: 4.8, numReviews: 156,
    isFeatured: false, tags: ['plants', 'home decor', 'garden'], reviews: [],
  },

  // ─── TOYS (6 products) ───
  {
    _id: 'toys001',
    name: 'LEGO Technic Bugatti Chiron',
    description: 'Build the iconic Bugatti Chiron with 3,599 pieces. Features a working W16 engine with moving pistons and rubber tires.',
    price: 39999, originalPrice: 46999,
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format',
    images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format'],
    category: 'Toys', brand: 'LEGO', stock: 18, rating: 4.9, numReviews: 78,
    isFeatured: true, tags: ['lego', 'technic', 'bugatti'], reviews: [],
  },
  {
    _id: 'toys002',
    name: 'Nintendo Switch OLED Console',
    description: 'Ultimate gaming with vivid 7" OLED screen, enhanced audio, wide adjustable stand, 64GB storage. Play at home or on the go.',
    price: 33999, originalPrice: 37999,
    image: `${BASE}/images/nintendo_switch.png`,
    images: [`${BASE}/images/nintendo_switch.png`],
    category: 'Toys', brand: 'Nintendo', stock: 22, rating: 4.9, numReviews: 634,
    isFeatured: true, tags: ['nintendo', 'gaming', 'console'], reviews: [],
  },
  {
    _id: 'toys003',
    name: 'LEGO City Police Station',
    description: '668-piece LEGO City Police Station with 6 minifigures, police car, motorcycle, and jail cell. Ages 6 and up.',
    price: 6499, originalPrice: 7999,
    image: `${BASE}/images/lego_city.png`,
    images: [`${BASE}/images/lego_city.png`],
    category: 'Toys', brand: 'LEGO', stock: 30, rating: 4.7, numReviews: 245,
    isFeatured: false, tags: ['lego', 'city', 'kids'], reviews: [],
  },
  {
    _id: 'toys004',
    name: 'RC Turbo Racing Car',
    description: 'Professional RC car with 50km/h top speed, 4WD all-terrain capability, waterproof electronics, 30-minute play time.',
    price: 10999, originalPrice: 13999,
    image: `${BASE}/images/rc_car.png`,
    images: [`${BASE}/images/rc_car.png`],
    category: 'Toys', brand: 'Traxxas', stock: 27, rating: 4.6, numReviews: 389,
    isFeatured: false, tags: ['rc car', 'remote control', 'racing'], reviews: [],
  },
  {
    _id: 'toys005',
    name: 'Programmable Robot Kit',
    description: 'STEM interactive robot with LED eyes, voice recognition, obstacle avoidance, app control. Teaches coding. Ages 8–14.',
    price: 12999, originalPrice: 16999,
    image: `${BASE}/images/robot_toy.png`,
    images: [`${BASE}/images/robot_toy.png`],
    category: 'Toys', brand: 'Makeblock', stock: 20, rating: 4.8, numReviews: 167,
    isFeatured: true, tags: ['robot', 'stem', 'coding', 'educational'], reviews: [],
  },
  {
    _id: 'toys006',
    name: 'Junior Science Lab Kit',
    description: 'Award-winning kit with 70+ experiments — chemistry, physics, biology. Comes with lab coat, safety goggles, and manual.',
    price: 4999, originalPrice: 6999,
    image: `${BASE}/images/science_kit.png`,
    images: [`${BASE}/images/science_kit.png`],
    category: 'Toys', brand: 'Thames & Kosmos', stock: 35, rating: 4.7, numReviews: 298,
    isFeatured: false, tags: ['science', 'educational', 'experiments', 'stem'], reviews: [],
  },
];

export const getStaticProducts = ({ keyword = '', category = '', featured = '', sort = 'newest', page = 1, pageSize = 12 } = {}) => {
  let results = [...staticProducts];

  if (keyword) results = results.filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()));
  if (category) results = results.filter(p => p.category === category);
  if (featured) results = results.filter(p => p.isFeatured);

  if (sort === 'price_asc') results.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') results.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') results.sort((a, b) => b.rating - a.rating);

  const total = results.length;
  const pages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const products = results.slice(start, start + pageSize);

  return { products, page, pages, total };
};

export const getStaticCategories = () => ['Electronics', 'Fashion', 'Home & Garden', 'Toys'];

export const getStaticProductById = (id) => staticProducts.find(p => p._id === id) || null;
