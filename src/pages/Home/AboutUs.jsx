import CountUp from 'react-countup';
import { Link } from "react-router-dom";
import { aboutInstructor } from "../../utilis/imageImports";

const subTitle = "Pourquoi nous choisir";
const title = "Devenez marchand";
const desc = "Suivez des formations sur n'importe quel appareil avec notre application et apprenez tout ce que vous voulez sur le commerce. Téléchargez, installez et commencez à apprendre";
const btnText = "Postuler maintenant";

const countList = [
    {
        iconName: 'icofont-users-alt-4',
        count: '12600',
        text: 'Marchands inscrits',
    },
    {
        iconName: 'icofont-graduate-alt',
        count: '30',
        text: 'Cours certifiés',
    },
    {
        iconName: 'icofont-notification',
        count: '100',
        text: 'Récompenses et cartes cadeaux',
    },
]

const AboutUs = () => {
  return (
    <div className="instructor-section style-2 padding-tb section-bg-ash">
    <div className="container">
        <div className="section-wrapper">
            <div className="row g-4 justify-content-center row-cols-1 row-cols-md-2 row-cols-xl-3 align-items-center">
                <div className="col">
                    {countList.map((val, i) => (
                        <div className="count-item" key={i}>
                            <div className="count-inner">
                                <div className="count-icon">
                                    <i className={val.iconName}></i>
                                </div>
                                <div className="count-content">
                                    <h2><span className="count"><CountUp end={val.count} /></span><span>+</span></h2>
                                    <p>{val.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="col">
                    <div className="instructor-content">
                        <span className="subtitle">{subTitle}</span>
                        <h2 className="title">{title}</h2>
                        <p>{desc}</p>
                        <Link to="/signup" className="lab-btn"><span>{btnText}</span></Link>
                    </div>
                </div>
                <div className="col">
                    <div className="instructor-thumb">
                        <img src={aboutInstructor} alt="instructor" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
  )
}

export default AboutUs