// Définition des chemins d'images avec des chemins absolus pour Next.js
// Ces images doivent être disponibles dans le dossier public
const dell = '/assets/img/brands/dell.png';
const honda = '/assets/img/brands/honda.png';
const xiaomi = '/assets/img/brands/xiaomi.png';
const intel = '/assets/img/brands/intel.png';
const asus = '/assets/img/brands/asus-rog.png';
const yamaha = '/assets/img/brands/yamaha.png';
const ibm = '/assets/img/brands/ibm.png';
const apple = '/assets/img/brands/apple-2.png';
const oppo = '/assets/img/brands/oppo.png';
const redragon = '/assets/img/brands/redragon.png';
const xbox = '/assets/img/brands/xbox.png';
const lenovo = '/assets/img/brands/lenovo.png';
const oneplus = '/assets/img/brands/oneplus-2.png';
const suzuki = '/assets/img/brands/suzuki-2.png';
const googleStore = '/assets/img/brands/google-store.png';
const hp = '/assets/img/brands/hp.png';

export type StoreItem = {
  name: string;
  rating: number;
  rated: number;
  logo: string;
};

export const stores: StoreItem[] = [
  {
    name: 'Dell Technologies',
    rating: 4,
    rated: 1263,
    logo: dell
  },
  {
    name: 'Intel',
    rating: 5,
    rated: 1542,
    logo: intel
  },
  {
    name: 'Honda',
    rating: 5,
    rated: 596,
    logo: honda
  },
  {
    name: 'Asus ROG',
    rating: 3,
    rated: 2365,
    logo: asus
  },
  {
    name: 'Yamaha',
    rating: 5,
    rated: 1253,
    logo: yamaha
  },
  {
    name: 'IBM',
    rating: 3,
    rated: 996,
    logo: ibm
  },
  {
    name: 'Apple Store',
    rating: 3,
    rated: 365,
    logo: apple
  },
  {
    name: 'Oppo',
    rating: 3,
    rated: 576,
    logo: oppo
  },
  {
    name: 'Redragon',
    rating: 2,
    rated: 1125,
    logo: redragon
  },
  {
    name: 'Microsoft XBOX',
    rating: 4,
    rated: 830,
    logo: xbox
  },
  {
    name: 'Lenovo',
    rating: 3,
    rated: 1032,
    logo: lenovo
  },
  {
    name: 'Xiaomi',
    rating: 3,
    rated: 965,
    logo: xiaomi
  },
  {
    name: 'Oneplus',
    rating: 4,
    rated: 562,
    logo: oneplus
  },
  {
    name: 'Suzuki',
    rating: 3,
    rated: 125,
    logo: suzuki
  },
  {
    name: 'Google store',
    rating: 4,
    rated: 1859,
    logo: googleStore
  },
  {
    name: 'HP Global Store',
    rating: 3,
    rated: 365,
    logo: hp
  }
];
