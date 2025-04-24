import { useState } from "react";
import Link from "next/link";
import Rating from "../../components/Sidebar/Rating";
import { 
  categoryTab01, categoryTab02, categoryTab03, categoryTab04, 
  categoryTab05, categoryTab06, categoryTab07, categoryTab08
} from "../../utils/imageImports";

const title = "Nos Produits";


const ProductData = [
    {
        imgUrl: categoryTab01,
        cate: 'Chaussures',
        title: 'Nike Premier X',
        author: 'assets/images/course/author/01.jpg',
        brand: 'Nike',
        price: '199,00 €',
        id: 1,
    },
    {
        imgUrl: categoryTab02,
        cate: 'Sacs',
        title: 'Sacs Esthétiques',
        author: 'assets/images/course/author/02.jpg',
        brand: 'D&J Bags',
        price: '199,00 €',
        id: 2,
    },
    {
        imgUrl: categoryTab03,
        cate: 'Téléphones',
        title: 'iPhone 12',
        brand: 'Apple',
        price: '199,00 €',
        id: 3,
    },
    {
        imgUrl: categoryTab04,
        cate: 'Sacs',
        title: 'Sac de Randonnée 15 Nh100',
        author: 'assets/images/course/author/04.jpg',
        brand: 'Gucci',
        price: '199,00 €',
        id: 4,
    },
    {
        imgUrl: categoryTab05,
        cate: 'Chaussures',
        title: 'Chaussures de Sport Outdoor',
        author: 'assets/images/course/author/05.jpg',
        brand: 'Nike',
        price: '199,00 €',
        id: 5,
    },
    {
        imgUrl: categoryTab06,
        cate: 'Beauté',
        title: 'COSRX Snail Mucin',
        author: 'assets/images/course/author/06.jpg',
        brand: 'Zaara',
        price: '199,00 €',
        id: 6,
    },
    {
        imgUrl: categoryTab07,
        cate: 'Sacs',
        title: 'Sac style Chanel',
        author: 'assets/images/course/author/01.jpg',
        brand: 'Gucci',
        price: '199,00 €',
        id: 7,
    },
    {
        imgUrl: categoryTab08,
        cate: 'Chaussures',
        title: 'Baskets Casual',
        author: 'assets/images/course/author/02.jpg',
        brand: 'Bata',
        price: '199,00 €',
        id: 8,
    },
]


const CategoryShowCase = () => {
    const [items, setItems] = useState(ProductData);
    const filterItem = (categItem) => {
        const updateItems = ProductData.filter((curElem) => {
            return curElem.cate === categItem;
        });
        setItems(updateItems);
    }
  return (
    <div className="course-section style-3 padding-tb">
    <div className="course-shape one">
      <img src="/assets/images/shape-img/icon/01.png" alt="education" />
    </div>
    <div className="course-shape two">
      <img src="/assets/images/shape-img/icon/02.png" alt="education" />
    </div>
    <div className="container">

        {/* section header */}
        <div className="section-header">
            <h2 className="title">{title}</h2>
            <div className="course-filter-group">
                <ul className="lab-ul">
                    <li onClick={() => setItems(ProductData) }>Tous</li>
                    <li onClick={() => filterItem('Chaussures') }>Chaussures</li>
                    <li onClick={() => filterItem('Sacs') }>Sacs</li>
                    <li onClick={() => filterItem('Téléphones') }>Téléphones</li>
                    <li onClick={() => filterItem('Beauté') }>Beauté</li>
                </ul>
            </div>
        </div>

        {/* section body */}
        <div className="section-wrapper">
            <div className="row g-4 justify-content-center row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 course-filter">
                { items.map((elem) => {
                    const { id, imgUrl, imgAlt, cate, title, brand, authorName, price } = elem;
                    return (
                        <div className="col" key={id}>
                            <div className="course-item style-4">
                                <div className="course-inner">
                                    <div className="course-thumb">
                                        <img src={imgUrl} alt="" />
                                        <div className="course-category">
                                            <div className="course-cate">
                                                <a href="#">{cate}</a>
                                            </div>
                                            <div className="course-reiew">
                                                <Rating />
                                            </div>
                                        </div>
                                    </div>

                                    {/* content  */}
                                    <div className="course-content">
                                        <Link href="/course-single">{title}</Link>
                                        <div className="course-footer">
                                            <div className="course-author">
                                                <Link href="/team-single" className="ca-name">{brand}</Link>
                                            </div>
                                            <div className="course-price">{price}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) })
                }
            </div>
        </div>
    </div>
</div>
  )
}

export default CategoryShowCase