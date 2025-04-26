import Link from "next/link";
import { category01, category02, category03, category04, category05, category06 } from "../../utils/imageImports";

const subTitle = "Choisissez parmi nos produits";
const title = "Achetez tout avec nous";
const btnText = "Commencer maintenant";

const categoryList = [
    {
        imgUrl: category01,
        imgAlt: 'category rajibraj91 rajibraj',
        iconName: 'icofont-brand-windows',
        title: 'Appareils photo',
    },
    {
        imgUrl: category02,
        imgAlt: 'category rajibraj91 rajibraj',
        iconName: 'icofont-brand-windows',
        title: 'Chaussures',
    },
    {
        imgUrl: category03,
        imgAlt: 'category rajibraj91 rajibraj',
        iconName: 'icofont-brand-windows',
        title: 'Photographie',
    },
    {
        imgUrl: category04,
        imgAlt: 'category rajibraj91 rajibraj',
        iconName: 'icofont-brand-windows',
        title: 'Tenues formelles',
    },
    {
        imgUrl: category05,
        imgAlt: 'category rajibraj91 rajibraj',
        iconName: 'icofont-brand-windows',
        title: 'Sacs colorés',
    },
    {
        imgUrl: category06,
        imgAlt: 'category rajibraj91 rajibraj',
        iconName: 'icofont-brand-windows',
        title: 'Déco maison',
    },
]

const HomeCategory = () => {
  return (
    <div className="category-section style-4 padding-tb">
    <div className="container">
        <div className="section-header text-center">
            <span className="subtitle">{subTitle}</span>
            <h2 className="title">{title}</h2>
        </div>
        <div className="section-wrapper">
            <div className="row g-4 justify-content-center row-cols-md-3 row-cols-sm-2 row-cols-1">
                {categoryList.map((val, i) => (
                    <div className="col" key={i}>
                        <Link href="/shop" className="category-item">
                            <div className="category-inner">
                                <div className="category-thumb">
                                    <img src={`${val.imgUrl}`} alt={`${val.imgAlt}`} />
                                </div>
                                <div className="category-content">
                                    <div className="cate-icon">
                                        <i className={`${val.iconName}`}></i>
                                    </div>
                                    <h6 onClick={() => window.location.href='/shop'}>{val.title}</h6>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            <div className="text-center mt-5">
                <Link href="/shop" className="lab-btn"><span>{btnText}</span></Link>
            </div>
        </div>
    </div>
</div>
  )
}

export default HomeCategory
