// Définition des chemins d'images (à déplacer dans public/assets/img/...).
// Pour une migration complète, ces images devraient être déplacées dans le dossier public
const blueFront = '/assets/img/products/details/blue_front.png';
const blueBack = '/assets/img/products/details/blue_back.png';
const blueSide = '/assets/img/products/details/blue_side.png';

const redFront = '/assets/img/products/details/red_front.png';
const redBack = '/assets/img/products/details/red_back.png';
const redSide = '/assets/img/products/details/red_side.png';

const greenFront = '/assets/img/products/details/green_front.png';
const greenBack = '/assets/img/products/details/green_back.png';
const greenSide = '/assets/img/products/details/green_side.png';

const purpleFront = '/assets/img/products/details/purple_front.png';
const purpleBack = '/assets/img/products/details/purple_back.png';
const purpleSide = '/assets/img/products/details/purple_side.png';

const silverFront = '/assets/img/products/details/silver_front.png';
const silverBack = '/assets/img/products/details/silver_back.png';
const silverSide = '/assets/img/products/details/silver_side.png';

const yellowFront = '/assets/img/products/details/yellow_front.png';
const yellowBack = '/assets/img/products/details/yellow_back.png';
const yellowSide = '/assets/img/products/details/yellow_side.png';

const orangeFront = '/assets/img/products/details/orange_front.png';
const orangeBack = '/assets/img/products/details/orange_back.png';
const orangeSide = '/assets/img/products/details/orange_side.png';

const review11 = '/assets/img/e-commerce/review-11.jpg';
const review12 = '/assets/img/e-commerce/review-12.jpg';
const review13 = '/assets/img/e-commerce/review-13.jpg';
const review14 = '/assets/img/e-commerce/review-14.jpg';
const review15 = '/assets/img/e-commerce/review-15.jpg';
const review16 = '/assets/img/e-commerce/review-16.jpg';
import { BadgeBg } from 'components/base/Badge';

type Category = {
  title: string;
  icon: string;
  sections: {
    label: string;
    url: string;
  }[];
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

type Variant = {
  id: string;
  name: string;
  thumb: string;
  images: string[];
};

export interface AddressTableDataType {
  labelIcon: string;
  label: string;
  value: string;
}

export interface CustomerOrder {
  orderId: string;
  totalPrice: number;
  payment_status: {
    status: string;
    type: BadgeBg;
    icon: string;
  };
  delivery_method: string;
  date: string;
}

export const categories: Category[] = [
  {
    title: 'Collectibles & Art',
    icon: 'pocket',
    sections: [
      {
        label: 'Collectibles',
        url: '#!'
      },
      {
        label: 'Antiques',
        url: '#!'
      },
      {
        label: 'Sports memorabilia ',
        url: '#!'
      },
      {
        label: 'Art',
        url: '#!'
      }
    ]
  },
  {
    title: 'Home & Gardan',
    icon: 'home',
    sections: [
      {
        label: 'Yard, Garden & Outdoor',
        url: '#!'
      },
      {
        label: 'Crafts',
        url: '#!'
      },
      {
        label: 'Home Improvement',
        url: '#!'
      },
      {
        label: 'Pet Supplies',
        url: '#!'
      }
    ]
  },
  {
    title: 'Sporting Goods',
    icon: 'globe',
    sections: [
      {
        label: 'Outdoor Sports',
        url: '#!'
      },
      {
        label: 'Team Sports',
        url: '#!'
      },
      {
        label: 'Exercise & Fitness',
        url: '#!'
      },
      {
        label: 'Golf',
        url: '#!'
      }
    ]
  },
  {
    title: 'Electronics',
    icon: 'monitor',
    sections: [
      {
        label: 'Computers & Tablets',
        url: '#!'
      },
      {
        label: 'Camera & Photo',
        url: '#!'
      },
      {
        label: 'TV, Audio & Surveillance',
        url: '#!'
      },
      {
        label: 'Cell Ohone & Accessories',
        url: '#!'
      }
    ]
  },
  {
    title: 'Auto Parts & Accessories',
    icon: 'truck',
    sections: [
      {
        label: 'GPS & Security Devices',
        url: '#!'
      },
      {
        label: 'Rader & Laser Detectors',
        url: '#!'
      },
      {
        label: 'Care & Detailing',
        url: '#!'
      },
      {
        label: 'Scooter Parts & Accessories',
        url: '#!'
      }
    ]
  },
  {
    title: 'Toys & Hobbies',
    icon: 'codesandbox',
    sections: [
      {
        label: 'Radio Control',
        url: '#!'
      },
      {
        label: 'Kids Toys',
        url: '#!'
      },
      {
        label: 'Action Figures',
        url: '#!'
      },
      {
        label: 'Dolls & Bears',
        url: '#!'
      }
    ]
  },
  {
    title: 'Fashion',
    icon: 'watch',
    sections: [
      {
        label: 'Women',
        url: '#!'
      },
      {
        label: 'Men',
        url: '#!'
      },
      {
        label: 'Jewelry & Watches',
        url: '#!'
      },
      {
        label: 'Shoes',
        url: '#!'
      }
    ]
  },
  {
    title: 'Musical Instruments & Gear',
    icon: 'music',
    sections: [
      {
        label: 'Guitar',
        url: '#!'
      },
      {
        label: 'Pro Audio Equipment',
        url: '#!'
      },
      {
        label: 'String',
        url: '#!'
      },
      {
        label: 'Stage Lighting & Effects',
        url: '#!'
      }
    ]
  },
  {
    title: 'Other Categories',
    icon: 'grid',
    sections: [
      {
        label: 'Video Games & Consoles',
        url: '#!'
      },
      {
        label: 'Health & Beauty',
        url: '#!'
      },
      {
        label: 'Baby',
        url: '#!'
      },
      {
        label: 'Business & Industrial',
        url: '#!'
      }
    ]
  }
];

export const productColorVariants: Variant[] = [
  {
    id: 'blue',
    name: 'Blue',
    thumb: blueFront,
    images: [blueFront, blueBack, blueSide]
  },
  {
    id: 'red',
    name: 'Red',
    thumb: redFront,
    images: [redFront, redBack, redSide]
  },
  {
    id: 'green',
    name: 'Green',
    thumb: greenFront,
    images: [greenFront, greenBack, greenSide]
  },
  {
    id: 'purple',
    name: 'Purple',
    thumb: purpleFront,
    images: [purpleFront, purpleBack, purpleSide]
  },
  {
    id: 'silver',
    name: 'Silver',
    thumb: silverFront,
    images: [silverFront, silverBack, silverSide]
  },
  {
    id: 'yellow',
    name: 'Yellow',
    thumb: yellowFront,
    images: [yellowFront, yellowBack, yellowSide]
  },
  {
    id: 'orange',
    name: 'Orange',
    thumb: orangeFront,
    images: [orangeFront, orangeBack, orangeSide]
  }
];

export const productReviews: ProductReviewType[] = [
  {
    id: 1,
    star: 5,
    customer: 'Zingko Kudobum',
    date: '35 mins ago',
    review: '100% satisfied',
    images: [review11, review12, review13],
    reply: {
      text: 'Thank you for your valuable feedback',
      from: 'store',
      time: '5 mins ago'
    }
  },
  {
    id: 2,
    star: 4,
    customer: 'Piere Auguste Renoir',
    date: '23 Oct, 12:09 PM',
    review:
      "Since the spring loaded event, I've been wanting an iMac, and it's exceeded my expectations. The screen is clear, the colors are vibrant (I got the blue one! ), and the performance is more than adequate for my needs as a college student. That's how good it is."
  },
  {
    id: 3,
    star: 3.5,
    customer: 'Abel Kablmann ',
    date: '21 Oct, 12:00 PM',
    review:
      "Over the years, I've preferred Apple products. My job has allowed me to use Windows products on laptops and PCs. I've owned Windows laptops and desktops for home use in the past and will never use them again."
  },
  {
    id: 4,
    star: 5,
    customer: 'Pennywise Alfred',
    date: '35 mins ago',
    review: 'Nice and beautiful product.',
    images: [review14, review15, review16]
  }
];

export const shippingDetailsAddress: AddressTableDataType[] = [
  {
    labelIcon: 'user',
    label: 'Name',
    value: 'Shatinon Mekalan'
  },
  {
    labelIcon: 'home',
    label: 'Address',
    value: 'Apt: 6/B, 192 Edsel Road, Van Nuys California, USA 96580'
  },
  {
    labelIcon: 'phone',
    label: 'Phone',
    value: '818-414-4092'
  }
];

export const customerOrders: CustomerOrder[] = [
  {
    orderId: '#2453',
    totalPrice: 87,
    payment_status: {
      status: 'Shipped',
      type: 'success',
      icon: 'check'
    },
    delivery_method: 'Cash on delivery',
    date: 'Dec 12, 12:56 PM'
  },
  {
    orderId: '#2452',
    totalPrice: 7264,
    payment_status: {
      status: 'Ready to pickup',
      type: 'info',
      icon: 'info'
    },
    delivery_method: 'Free shipping',
    date: 'Dec 9, 2:28PM'
  },
  {
    orderId: '#2451',
    totalPrice: 375,
    payment_status: {
      status: 'Partially fulfilled',
      type: 'warning',
      icon: 'clock'
    },
    delivery_method: 'Local pickup',
    date: 'Dec 4, 12:56 PM'
  },
  {
    orderId: '#2450',
    totalPrice: 657,
    payment_status: {
      status: 'Canceled',
      type: 'secondary',
      icon: 'x'
    },
    delivery_method: 'Standard shipping',
    date: 'Dec 1, 4:07 AM'
  },
  {
    orderId: '#2449',
    totalPrice: 9562,
    payment_status: {
      status: 'fulfilled',
      type: 'success',
      icon: 'check'
    },
    delivery_method: 'Express',
    date: 'Nov 28, 7:28 PM'
  },
  {
    orderId: '#2448',
    totalPrice: 256,
    payment_status: {
      status: 'Unfulfilled',
      type: 'danger',
      icon: 'check'
    },
    delivery_method: 'Local delivery',
    date: 'Nov 24, 10:16 AM'
  },
  {
    orderId: '#2447',
    totalPrice: 898,
    payment_status: {
      status: 'Cancelled',
      type: 'secondary',
      icon: 'x'
    },
    delivery_method: 'Standard shipping',
    date: 'Nov 10, 12:00 PM'
  },
  {
    orderId: '#2446',
    totalPrice: 4116,
    payment_status: {
      status: 'shipped',
      type: 'success',
      icon: 'check'
    },
    delivery_method: 'Express',
    date: 'Nov 12, 12:20 PM'
  },
  {
    orderId: '#2445',
    totalPrice: 4116,
    payment_status: {
      status: 'fulfilled',
      type: 'success',
      icon: 'check'
    },
    delivery_method: 'Free shipping',
    date: 'Oct 19, 1:20 PM'
  }
];
