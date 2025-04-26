// utils/placeholderData.js
export const placeholderProductData = {
    id: "imac-blue-m1",
    // ... (copy the full placeholder object here) ...
     name: '24" iMac® with Retina 4.5K display - Apple M1 8GB Memory - 256GB SSD - Blue',
     price: 1499.99,
     salePrice: 1349.99,
     img: "/assets/images/products/01.jpg",
     thumbnails: [
       "/assets/images/products/01.jpg",
       "/assets/images/products/02.jpg",
       "/assets/images/products/03.jpg",
       "/assets/images/products/placeholder-60x60.png", // Example placeholder
     ],
     ratings: 4.8,
     ratingsCount: 6548,
     categoryBreadcrumbs: [ /* Should match category structure */
       "Electronics",
       "Computers",
       "Desktops",
       "iMac",
     ],
     badges: ["#1 Best seller", "New Arrival"],
     stock: 15,
     deliveryEstimate: "Saturday, July 29th", // Should be dynamic ideally
     specialOfferEndDate: new Date( Date.now() + 23 * 60 * 60 * 1000 ).toISOString(),
     colors: [
       { name: "Blue", hex: "#a0ced9", img: "/assets/images/products/01.jpg" },
       { name: "Pink", hex: "#ffb6c1", img: "/assets/images/products/02.jpg" },
       { name: "Green", hex: "#a8e6cf" }, // Color without specific image
     ],
     sizes: ["256GB SSD", "512GB SSD", "1TB SSD"],
     description:
       "The M1 chip brings its extraordinary power, efficiency, and capabilities to iMac. So you can do it all on iMac faster than ever. M1 is the fastest CPU we’ve ever made. With that speed and power, iMac is more than a computer. It’s a statement.",
     specifications: [
       "Apple M1 chip with 8-core CPU and 8-core GPU",
       "8GB unified memory",
       "256GB SSD storage",
       "Two Thunderbolt / USB 4 ports",
       "Magic Keyboard",
       "Magic Mouse",
     ],
     reviews: [
         { id: 1, user: "Jane D.", rating: 5, comment: "Amazing machine! Fast, beautiful display, and the M1 chip is a game-changer." },
         { id: 2, user: "Mark S.", rating: 4, comment: "Great computer, but wish it had more ports without needing a dongle." },
         { id: 3, user: "Alice B.", rating: 5, comment: "Perfect for my design work. Handles large files smoothly." }
        ],
     boughtTogether: [
       {
         id: "magicmouse",
         name: "Apple Magic Mouse (Wireless, Rechargeable) - Silver",
         price: 89.00,
         img: "/assets/images/products/06.jpg",
       },
       {
         id: "magickeyboard",
         name: "Apple Magic Keyboard with Touch ID",
         price: 149.00,
         img: "/assets/images/products/placeholder-40x40.png", // Placeholder
       },
     ],
     similarProducts: [
       {
         id: "macbook-air-m2",
         name: "MacBook Air with M2 chip - Midnight",
         price: 1199.00,
         img: "/assets/images/products/07.jpg", // Replace with actual similar product img
         ratings: 4.9,
         ratingsCount: 1024,
       },
        {
         id: "dell-xps-13",
         name: "Dell XPS 13 Laptop - Intel Core i7",
         price: 1249.99,
         img: "/assets/images/products/placeholder-150x150.png", // Placeholder
         ratings: 4.7,
         ratingsCount: 875,
       },
        {
         id: "surface-pro-9",
         name: "Microsoft Surface Pro 9 - 13” Touchscreen",
         price: 999.99,
         img: "/assets/images/products/placeholder-150x150-2.png", // Placeholder
         ratings: 4.6,
         ratingsCount: 512,
       },
     ],
};