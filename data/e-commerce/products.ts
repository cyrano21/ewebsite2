// data/e-commerce/products.ts

// Supprimé : Imports d'images comme modules.
// Les images doivent être dans le dossier `public` et référencées par leur chemin URL.
// Exemple : 'assets/img/products/1.png' devient '/assets/img/products/1.png' si l'image est dans public/assets/img/products/1.png

// Les types restent les mêmes, ils attendent déjà des strings pour les images.
export type Product = {
  id: number;
  image: string; // Doit être le chemin URL public (string)
  name: string;
  rating: number;
  rated?: number;
  price?: number;
  salePrice?: number;
  colors?: number; // Note: Ce type est un nombre, pas un tableau de couleurs détaillé
  extra?: string;
  extraClass?: string;
  extra2?: string;
  extra2Class?: string;
  verified?: boolean;
  wishListed?: boolean;
  offer?: string;
  dealEndTime?: string;
};

export type SuggestedProductType = {
  id: number;
  checked: boolean;
  img: string; // Doit être le chemin URL public (string)
  name: string;
  price: number;
};

export type ProductReviewType = {
  id: number;
  star: number;
  customer: string;
  date: string;
  review: string;
  images?: string[];
  reply?: {
    text: string;
    from: string;
    time: string;
  };
};

export type CartItemType = {
  id: number | string;
  name: string;
  image: string; // Doit être le chemin URL public (string)
  color: string;
  price: number;
  size: string;
  quantity: number;
  total: number;
};

export type WishlistProductType = {
  product: string;
  productImage: string; // Doit être le chemin URL public (string)
  color: string;
  price: number;
  size: number | string;
  quantity: number;
};

export type StoreProductType = {
  product: string;
  productImage: string; // Doit être le chemin URL public (string)
  orders: number;
  rating: number;
  totalSpent: number;
  lastOrderDate: string;
};

export type ProductsTableProductType = {
  product: string;
  productImage: string; // Doit être le chemin URL public (string)
  price?: number;
  priceMin?: number;
  priceMax?: number;
  category: string;
  tags: string[];
  starred: boolean;
  vendor: string;
  publishedOn: string;
};

// --- Tableaux de produits avec chemins d'images corrigés ---
export const topDealsProducts: Product[] = [
  {
    id: 1,
    image: '/assets/images/products/06.jpg', // Chemin et nom corrects
    name: 'PlayStation 5 DualSense Wireless Controller',
    rating: 5, rated: 67, price: 125, salePrice: 89.0, colors: 2, extra: 'dbrand skin available', extraClass: 'text-body-highlight fw-bold mb-2'
  },
  {
    id: 2,
    image: '/assets/images/products/01.jpg', // Chemin et nom corrects
    name: 'Fitbit Sense Advanced Smartwatch with Tools for Heart Health, Stress Management & Skin Temperature Trends, Carbon/Graphite, One Size (S & L Bands)',
    verified: true, rating: 5, rated: 74, price: 49.99, salePrice: 34.99, dealEndTime: 'days'
  },
  {
    id: 3,
    image: '/assets/images/products/02.jpg', // Chemin et nom corrects
    name: 'iPhone 13 pro max-Pacific Blue, 128GB storage',
    rating: 5, rated: 33, price: 899.99, salePrice: 850.99, colors: 5, extra: 'Stock limited', extraClass: 'text-body-highlight fw-bold mb-2'
  },
  {
    id: 4,
    image: '/assets/images/products/03.jpg', // Chemin et nom corrects
    name: 'Apple MacBook Pro 13 inch-M1-8/256GB-Space Gray',
    rating: 5, rated: 97, price: 1299.0, salePrice: 1149.0, colors: 2, extra: 'Apple care included', extraClass: 'text-body-highlight fw-bold mb-2'
  },
  {
    id: 5,
    image: '/assets/images/products/04.jpg', // Chemin et nom corrects
    name: 'Apple iMac 24" 4K Retina Display M1 8 Core CPU, 7 Core GPU, 256GB SSD, Green (MJV83ZP/A) 2021',
    rating: 5, rated: 134, price: 1499, salePrice: 1399, colors: 7, extra: 'Exchange with kidney', extraClass: 'text-body-highlight fw-bold mb-2'
  },
  {
    id: 6,
    image: '/assets/images/products/05.jpg', // Chemin et nom corrects
    name: 'Razer Kraken v3 x Wired 7.1 Surroung Sound Gaming headset',
    rating: 5, rated: 59, salePrice: 59, colors: 2
  }
];

export const topElectronicProducts: Product[] = [
  {
    id: 7,
    image: '/assets/images/products/05.jpg', // Chemin et nom corrects
    name: 'Razer Kraken v3 x Wired 7.1 Surroung Sound Gaming headset',
    rating: 5, rated: 59, salePrice: 59, colors: 2
  },
  {
    id: 8,
    image: '/assets/images/products/07.jpg', // Chemin et nom corrects
    name: '2021 Apple 12.9-inch iPad Pro (Wi‑Fi, 128GB) - Space Gray',
    rating: 5, rated: 13, salePrice: 799, colors: 2
  },
  {
    id: 9,
    image: '/assets/images/categoryTab/12.jpg', // Image 12 se trouve dans categoryTab
    name: 'HORI Racing Wheel Apex for PlayStation 4/3, and PC',
    rating: 5, rated: 64, salePrice: 299, colors: 1, extra: 'Leather cover add-on available', extraClass: 'text-body-highlight fs--1 mb-0 fw-bold', extra2: 'supports Windows 11', extra2Class: 'text-body-tertiary fs--1 mb-2'
  },
  {
    id: 10,
    image: '/assets/images/products/01.jpg', // Chemin et nom corrects
    name: 'Amazfit T-Rex Pro Smart Watch with GPS, Outdoor Fitness Watch for Men, Military Standard Certified',
    verified: true, wishListed: true, rating: 5, rated: 32, salePrice: 20, dealEndTime: '24 hours'
  },
   {
    id: 11,
    image: '/assets/images/categoryTab/16.jpg', // Image 16 se trouve dans categoryTab
    name: 'Apple AirPods Pro',
    rating: 5, rated: 39, salePrice: 59, colors: 3, extra: 'Free with iPhone 5s', extraClass: 'text-body-highlight fs--1 mb-0 fw-bold', extra2: 'Ships to Canada', extra2Class: 'text-body-tertiary fs--1 mb-2'
  },
  {
    id: 12,
    // L'image 10 est dans categoryTab. L'image 08 est dans products.
    // Choisissez celle qui correspond à la Magic Mouse. Utilisons 10 pour l'instant.
    image: '/assets/images/categoryTab/10.jpg', // Image 10 se trouve dans categoryTab
    name: 'Apple Magic Mouse (Wireless, Rechargable) - Silver',
    rating: 1, rated: 6, salePrice: 89, colors: 2, extra: 'Bundle available', extraClass: 'text-body-highlight fs--1 mb-0 fw-bold', extra2: 'Charger not included', extra2Class: 'text-body-tertiary fs--1 mb-2'
  },
  {
    id: 13,
    name: 'Amazon Basics Matte Black Wired Keyboard - US Layout (QWERTY)',
    image: '/assets/images/products/08.jpg', // Chemin et nom corrects
    salePrice: 98, rating: 3, rated: 7, colors: 1
  }
];

export const bestOfferProducts: Product[] = [
  {
    id: 14,
    image: '/assets/images/categoryTab/25.jpg', // Image 25 se trouve dans categoryTab
    name: 'RESPAWN 200 Racing Style Gaming Chair, in Gray RSP 200 GRY',
    offer: '35%', rating: 5
  },
  {
    id: 15,
    image: '/assets/images/categoryTab/27.jpg', // Image 27 se trouve dans categoryTab
    name: 'LEVOIT Humidifiers for Bedroom Large Room 6L Warm and Cool Mist for...',
    offer: '18%', rating: 4
  },
  {
    id: 16,
    image: '/assets/images/categoryTab/26.jpg', // Image 26 se trouve dans categoryTab
    name: 'NETGEAR Nighthawk Pro Gaming XR500 Wi-Fi Router with 4 Ethernet Ports...',
    offer: '15%', rating: 5
  },
  {
    id: 17,
    image: '/assets/images/categoryTab/18.jpg', // Image 18 se trouve dans categoryTab
    name: 'Rachael Ray Cucina Bakeware Set Includes Nonstick Bread Baking Cookie Sheet...',
    offer: '20%', rating: 3.5
  },
  {
    id: 18,
    image: '/assets/images/categoryTab/17.jpg', // Image 17 se trouve dans categoryTab
    name: 'Xbox Series S',
    offer: '12%', rating: 5
  },
  {
    id: 19,
    image: '/assets/images/categoryTab/24.jpg', // Image 24 se trouve dans categoryTab
    name: 'FURINNO Computer Writing Desk, Walnut',
    offer: '16%', rating: 5
  },
  {
    id: 20,
    name: 'Seagate Portable 2TB External Hard Drive Portable HDD',
    image: '/assets/images/categoryTab/18.jpg', // Image 18 se trouve dans categoryTab
    offer: '15%', rating: 4
  }
];

export const suggestedProducts: SuggestedProductType[] = [
  {
    id: 1,
    checked: true,
    img: '/assets/images/products/02.jpg', // Chemin et nom corrects
    name: 'iPhone 13 pro max-Pacific Blue- 128GB',
    price: 899.99
  },
  {
    id: 2,
    checked: true,
    img: '/assets/images/categoryTab/16.jpg', // Image 16 se trouve dans categoryTab
    name: 'Apple AirPods Pro',
    price: 59.0
  },
  {
    id: 3,
    checked: false,
    img: '/assets/images/categoryTab/10.jpg', // Image 10 se trouve dans categoryTab (Magic Mouse?)
    name: 'Apple Magic Mouse (Wireless, Rechargable) - Silver, Worst mouse ever',
    price: 89.0
  }
];

export const cartItems: CartItemType[] = [
  {
    id: 1,
    name: 'Fitbit Sense Advanced Smartwatch with Tools for Heart Health, Stress Management & Skin Temperature Trends, Carbon/Graphite, One Size (S & L Bands)',
    image: '/assets/images/products/01.jpg', // Chemin et nom corrects
    color: 'Glossy black', price: 199, size: 'XL', quantity: 2, total: 398
  },
  {
    id: 2,
    name: 'iPhone 13 pro max-Pacific Blue-128GB storage',
    image: '/assets/images/products/02.jpg', // Chemin et nom corrects
    color: 'Glossy black', price: 150, size: 'XL', quantity: 2, total: 300
  },
  {
    id: 3,
    name: 'Apple MacBook Pro 13 inch-M1-8/256GB-space',
    image: '/assets/images/products/03.jpg', // Chemin et nom corrects
    color: 'Glossy Golden', price: 65, size: '34mm', quantity: 2, total: 130
  }
];

export const wishlistProducts: WishlistProductType[] = [
  {
    product: 'Fitbit Sense Advanced Smartwatch with Tools for Heart Health, Stress Management & Skin Temperature Trends, Carbon/Graphite, One Size (S & L Bands)',
    productImage: '/assets/images/products/01.jpg', // Chemin et nom corrects
    color: 'Pure matte black', price: 57, size: 42, quantity: 4
  },
  {
    product: '2021 Apple 12.9-inch iPad Pro (Wi‑Fi, 128GB) - Space Gray',
    productImage: '/assets/images/products/07.jpg', // Chemin et nom corrects
    color: 'Black', price: 1499, size: 'Pro', quantity: 2
  },
  {
    product: 'PlayStation 5 DualSense Wireless Controller',
    productImage: '/assets/images/products/06.jpg', // Chemin et nom corrects
    color: 'White', price: 299, size: 'Regular', quantity: 2
  },
  {
    product: 'Apple MacBook Pro 13 inch-M1-8/256GB-space',
    productImage: '/assets/images/products/03.jpg', // Chemin et nom corrects
    color: 'Space Gray', price: 1699, size: 'Pro', quantity: 2
  },
  {
    product: 'Apple iMac 24" 4K Retina Display M1 8 Core CPU, 7 Core GPU, 256GB SSD, Green (MJV83ZP/A) 2021',
    productImage: '/assets/images/products/04.jpg', // Chemin et nom corrects
    color: 'Ocean Blue', price: 65, size: '21"', quantity: 1
  },
  {
    product: 'Apple Magic Mouse (Wireless, Rechargable) - Silver',
    productImage: '/assets/images/categoryTab/10.jpg', // Image 10 dans categoryTab
    color: 'White', price: 30, size: 'Regular', quantity: 3
  },
  {
    product: 'Amazon Basics Matte Black Wired Keyboard - US Layout (QWERTY)',
    productImage: '/assets/images/products/08.jpg', // Chemin et nom corrects
    color: 'Black', price: 40, size: 'MD', quantity: 2
  },
  {
    product: 'HORI Racing Wheel Apex for PlayStation 4_3, and PC',
    productImage: '/assets/images/categoryTab/12.jpg', // Image 12 dans categoryTab
    color: 'Black', price: 130, size: '45', quantity: 1
  },
  {
    product: 'Xbox Series S',
    productImage: '/assets/images/categoryTab/17.jpg', // Image 17 dans categoryTab
    color: 'Space Gray', price: 99, size: 'sm', quantity: 1
  }
];

export const storeProducts: StoreProductType[] = [
  {
    product: 'Dell Technologies',
    // Supposons que Dell = 01.png dans sponsor (A VERIFIER)
    productImage: '/assets/images/sponsor/01.png',
    rating: 5, orders: 3, totalSpent: 1250, lastOrderDate: 'Dec 12, 12:56 PM'
  },
  {
    product: 'Honda',
    // Supposons que Honda = 02.png dans sponsor (A VERIFIER)
    productImage: '/assets/images/sponsor/02.png',
    rating: 3, orders: 5, totalSpent: 1499, lastOrderDate: 'Dec 09, 10:48 AM'
  },
  {
    product: 'Xiaomi',
    // Supposons que Xiaomi = 03.png dans sponsor (A VERIFIER)
    productImage: '/assets/images/sponsor/03.png',
    rating: 3, orders: 6, lastOrderDate: 'Dec 03, 05:45 PM', totalSpent: 360
  },
  {
    product: 'Huawei Shop BD',
     // Supposons que Huawei = 04.png dans sponsor (A VERIFIER)
    productImage: '/assets/images/sponsor/04.png',
    rating: 3, orders: 1, lastOrderDate: 'Nov 27, 06:20 PM', totalSpent: 1799
  },
  {
    product: 'Intel',
    // Supposons que Intel = 05.png dans sponsor (A VERIFIER)
    productImage: '/assets/images/sponsor/05.png',
    rating: 4, orders: 2, lastOrderDate: 'Nov 21, 10:25 AM', totalSpent: 65
  }
];

export const allProducts: Product[] = [
  ...topDealsProducts,
  ...topElectronicProducts.slice(1, -1), // Careful with slice
  {
    id: 21,
    image: '/assets/images/categoryTab/25.jpg', // Image 25 dans categoryTab
    name: 'RESPAWN 200 Racing Style Gaming Chair, in Gray RSP 200 GRY',
    rating: 5, rated: 8, salePrice: 499, colors: 2
  },
  {
    id: 22,
    image: '/assets/images/categoryTab/27.jpg', // Image 27 dans categoryTab
    name: 'LEVOIT Humidifiers for Bedroom Large Room 6L Warm and Cool Mist for...',
    rating: 5, rated: 3, salePrice: 299, colors: 3
  },
  {
    id: 23,
    image: '/assets/images/categoryTab/26.jpg', // Image 26 dans categoryTab
    name: 'NETGEAR Nighthawk Pro Gaming XR500 Wi-Fi Router with 4 Ethernet Ports...',
    rating: 5, rated: 8, salePrice: 49, colors: 4
  },
  {
    id: 24,
    image: '/assets/images/categoryTab/18.jpg', // Image 18 dans categoryTab
    name: 'Rachael Ray Cucina Bakeware Set Includes Nonstick Bread Baking Cookie Sheet...',
    rating: 5, rated: 1, salePrice: 29, colors: 3
  },
  {
    id: 25,
    image: '/assets/images/categoryTab/17.jpg', // Image 17 dans categoryTab
    name: 'Xbox Series S',
    rating: 5, rated: 6, salePrice: 19, colors: 2
  },
  {
    id: 26,
    image: '/assets/images/categoryTab/24.jpg', // Image 24 dans categoryTab
    name: 'FURINNO Computer Writing Desk, Walnut',
    rating: 5, rated: 8, salePrice: 199, colors: 2
  },
  {
    id: 27,
    image: '/assets/images/categoryTab/20.jpg', // Image 20 dans categoryTab
    name: 'ASUS TUF Gaming F15 Gaming Laptop',
    rating: 4, rated: 3, salePrice: 150, colors: 2
  }
];

export const productsTableData: ProductsTableProductType[] = [
  {
    product: 'Fitbit Sense Advanced Smartwatch with Tools for Heart Health, Stress Management & Skin Temperature Trends, Carbon/Graphite, One Size (S & L Bands...',
    productImage: '/assets/images/products/01.jpg', // Correct
    price: 39, category: 'Plants', tags: ['Health', 'Exercise', 'Discipline', 'Lifestyle', 'Fitness'], starred: false, vendor: 'Blue Olive Plant sellers. Inc', publishedOn: 'Nov 12, 10:45 PM'
  },
  {
    product: 'iPhone 13 pro max-Pacific Blue-128GB storage',
    productImage: '/assets/images/products/02.jpg', // Correct
    price: 87, category: 'Furniture', tags: ['Class', 'Camera', 'Discipline', 'invincible', 'Pro', 'Swag'], starred: true, vendor: 'Beatrice Furnitures', publishedOn: 'Nov 11, 7:36 PM'
  },
   {
    product: 'Apple MacBook Pro 13 inch-M1-8/256GB-space',
    productImage: '/assets/images/products/03.jpg', // Correct
    price: 9, category: 'Plants', tags: ['Efficiency', 'Handy', 'Apple', 'Creativity', 'Gray'], starred: false, vendor: 'PlantPlanet', publishedOn: 'Nov 11, 8:16 AM'
  },
  {
    product: 'Apple iMac 24" 4K Retina Display M1 8 Core CPU...',
    productImage: '/assets/images/products/04.jpg', // Correct
    priceMin: 8, priceMax: 58, category: 'Toys', tags: ['Color', 'Stunning', 'Retina', 'Green', 'PC killer'], starred: false, vendor: 'Kizzstore', publishedOn: 'Nov 8, 6:39 PM'
  },
   {
    product: 'Razer Kraken v3 x Wired 7.1 Surroung Sound Gaming headset',
    productImage: '/assets/images/products/05.jpg', // Correct
    price: 120, category: 'Fashion', tags: ['Music', 'Audio', 'Meeting', 'Record', 'Sound'], starred: false, vendor: 'Inertia Fashion', publishedOn: 'Nov 8, 5:32 PM'
  },
   {
    product: 'PlayStation 5 DualSense Wireless Controller',
    productImage: '/assets/images/products/06.jpg', // Correct
    price: 239, category: 'Gadgets', tags: ['Game', 'Control', 'Nav', 'Playstation', 'Wireless'], starred: false, vendor: 'FutureTech Inc', publishedOn: 'Nov 6, 11:34 PM'
  },
   {
    product: '2021 Apple 12.9-inch iPad Pro (Wi‑Fi, 128GB) - Space Gray',
    productImage: '/assets/images/products/07.jpg', // Correct
    price: 4, category: 'Food', tags: ['Ipad', 'Pro', 'Creativity', 'Thunderbolt', 'Space'], starred: false, vendor: 'Maimuna’s Bakery', publishedOn: 'Nov 1, 7:45 AM'
  },
   {
    product: 'Amazon Basics Matte Black Wired Keyboard - US Layout (QWERTY)',
    productImage: '/assets/images/products/08.jpg', // Correct
    price: 98, category: 'Fashion', tags: ['Keyboard', 'Smooth', 'Butter', 'RGB', 'Black'], starred: false, vendor: 'Green fashion', publishedOn: 'Nov 3, 12:27 PM'
  },
  {
    product: 'Apple Magic Mouse (Wireless, Rechargable) - Silver',
    productImage: '/assets/images/categoryTab/10.jpg', // Correct, vient de categoryTab
    price: 568, category: 'Fashion', tags: ['Apple', 'Wireless', 'Battery', 'Magic', 'Performance'], starred: false, vendor: 'Eastacy', publishedOn: 'Nov 1, 9:39 AM'
  },
   {
    product: 'HORI Racing Wheel Apex for PlayStation 4_3, and PC',
    productImage: '/assets/images/categoryTab/12.jpg', // Correct, vient de categoryTab
    price: 17, category: 'Drinks', tags: ['Steering', 'Gaming', 'PS4/3', 'Racing', 'Apex'], starred: false, vendor: 'BrewerBro', publishedOn: 'Oct 30, 3:49 PM'
  },
  {
    product: 'Apple Pencil (2nd Generation)',
    productImage: '/assets/images/categoryTab/21.jpg', // Correct, vient de categoryTab
    price: 28, category: 'Fashion', tags: ['Apple', 'Creativity', 'Color', 'Stunning', 'Apex'], starred: false, vendor: 'Eastacy', publishedOn: 'Nov 25, 5:00 PM'
  },
   {
    product: 'Apple AirPods (2nd Generation)',
    productImage: '/assets/images/categoryTab/16.jpg', // Correct, vient de categoryTab
    price: 20, category: 'Fashion', tags: ['Music', 'Audio', 'Meeting', 'Record', 'Sound'], starred: true, vendor: 'FutureTech Inc', publishedOn: 'Sep 20, 1:00 PM'
  },
   {
    product: 'Xbox Series S',
    productImage: '/assets/images/categoryTab/17.jpg', // Correct, vient de categoryTab
    price: 30, category: 'Gadget', tags: ['Lifestyle', 'Audio', 'Magic', 'Performance', 'Apex'], starred: false, vendor: 'FutureTech Inc', publishedOn: 'Oct 18, 3:40 PM'
  },
   {
    product: 'Seagate Portable 2TB External Hard Drive Portable HDD',
    productImage: '/assets/images/categoryTab/18.jpg', // Correct, vient de categoryTab
    price: 50, category: 'Accessories', tags: ['Portable', 'Gaming', 'Magic', 'Performance', 'Black'], starred: false, vendor: 'Kizzstore', publishedOn: 'Sep 20, 1:00 PM'
  },
   {
    product: 'Intel Core i9-11900K Desktop Processor 8 Cores up to 5.3 GHz Unlocked',
    productImage: '/assets/images/categoryTab/19.jpg', // Correct, vient de categoryTab
    price: 80, category: 'Accessories', tags: ['Intel', 'Gaming', 'Apex', 'Performance', 'Lifestyle'], starred: true, vendor: 'BrewerBro', publishedOn: 'Dec 01, 12:00 PM'
  },
   {
    product: 'ASUS TUF Gaming F15 Gaming Laptop',
    productImage: '/assets/images/categoryTab/20.jpg', // Correct, vient de categoryTab
    price: 150, category: 'Computer', tags: ['Gaming', 'Battery', 'Performance', 'Wireless'], starred: false, vendor: 'Kizzstore', publishedOn: 'Dec 01, 12:00 PM'
  }
];