import Link from "next/link";
import Image from "next/image";
import { app01, app02 } from "../../utils/imageImports";

const btnText = "Inscrivez-vous gratuitement";
const title = "Apprenez à tout moment, n'importe où";
const desc = "Suivez nos cours sur n'importe quel appareil avec notre application et apprenez quand vous le voulez. Téléchargez, installez et commencez à apprendre";

const AppSection = () => {
  return (
      <div className="app-section padding-tb">
          <div className="container">
              <div className="section-header text-center">
                  <Link href="/signup" className="lab-btn mb-4" legacyBehavior><span>{btnText}</span></Link>
                  <h2 className="title">{title}</h2>
                  <p>{desc}</p>
              </div>
              <div className="section-wrapper">
                  <ul className="lab-ul">
                      <li>
                          <a href="#">
                              <Image 
                                  src={app01} 
                                  alt="education" 
                                  width={180} 
                                  height={60} 
                                  style={{ maxWidth: '100%', height: 'auto' }} 
                              />
                          </a>
                      </li>
                      <li>
                          <a href="#">
                              <Image 
                                  src={app02} 
                                  alt="education" 
                                  width={180} 
                                  height={60} 
                                  style={{ maxWidth: '100%', height: 'auto' }} 
                              />
                          </a>
                      </li>
                  </ul>
              </div>
          </div>
      </div>
  );
}

export default AppSection
