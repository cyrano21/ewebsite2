import Link from "next/link";
import { clientAvatar } from "../../utils/imageImports";

const title = <h2 className="title">Plus de <span className="yellow-color">60 000</span> clients</h2>;
const desc = "Achetez des produits sur n'importe quel appareil avec notre application et profitez de votre temps comme vous le souhaitez. Téléchargez, installez et commencez à faire vos achats";


const clientsList = [
    {
        imgUrl: clientAvatar,
        imgAlt: 'education thumb rajibraj91 rajibraj',
        text: 'Rejoignez-nous',
    },
    {
        imgUrl: clientAvatar,
        imgAlt: 'education thumb rajibraj91 rajibraj',
        text: 'Rejoignez-nous',
    },
    {
        imgUrl: clientAvatar,
        imgAlt: 'education thumb rajibraj91 rajibraj',
        text: 'Rejoignez-nous',
    },
    {
        imgUrl: clientAvatar,
        imgAlt: 'education thumb rajibraj91 rajibraj',
        text: 'Rejoignez-nous',
    },
    {
        imgUrl: clientAvatar,
        imgAlt: 'education thumb rajibraj91 rajibraj',
        text: 'Rejoignez-nous',
    },
    {
        imgUrl: clientAvatar,
        imgAlt: 'education thumb rajibraj91 rajibraj',
        text: 'Rejoignez-nous',
    },
    {
        imgUrl: clientAvatar,
        imgAlt: 'education thumb rajibraj91 rajibraj',
        text: 'Rejoignez-nous',
    },
]
const LocationSprade = () => {
  return (
    <div className="clients-section style-2 padding-tb">
    <div className="container">
        <div className="section-header text-center">
            {title}
            <p>{desc}</p>
        </div>
        <div className="section-wrapper">
            <div className="clients">
                {clientsList.map((val, i) => (
                    <div className="client-list" key={i}>
                        <Link href="/signup" className="client-content"><span>{val.text}</span></Link>
                        <div className="client-thumb">
                            <img src={`${val.imgUrl}`} alt={`${val.imgAlt}`} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
</div>
  )
}

export default LocationSprade
