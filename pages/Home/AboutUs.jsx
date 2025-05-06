import React from 'react';
import CountUp from 'react-countup';
import Link from 'next/link';
import Image from 'next/image';
import { aboutInstructor } from "../../utils/imageImports";

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

function AboutUs() {
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
                              <Link href="/signup" className="lab-btn" legacyBehavior><span>{btnText}</span></Link>
                          </div>
                      </div>
                      <div className="col">
                          <div className="instructor-thumb">
                              <Image 
                                src={aboutInstructor || '/assets/images/instructor/instructor2.png'} 
                                alt="instructor" 
                                width={500} 
                                height={500} 
                                className="object-cover"
                                onError={(e) => {
                                  e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" fill="%23f3f4f6"><rect width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236b7280">Instructor</text></svg>';
                                }}
                              />
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
}

export default AboutUs;
