import React from "react";
import GoogleMap from "../../components/Sidebar/GoogleMap";
import PageHeader from "../../components/PageHeader";
import { icon01, icon02, icon03, icon04 } from "../../utils/imageImports";

const subTitle = "Contactez-nous";
const title = "Nous sommes toujours prêts à vous répondre !";
const conSubTitle = "Contactez-nous";
const conTitle =
  "Remplissez le formulaire ci-dessous pour que nous puissions mieux vous connaître et comprendre vos besoins.";
const btnText = "Envoyer votre message";

const contactList = [
  {
    imgUrl: icon01,
    imgAlt: "contact icon",
    title: "Adresse",
    desc: "1201 park street, Fifth Avenue",
  },
  {
    imgUrl: icon02,
    imgAlt: "contact icon",
    title: "Téléphone",
    desc: "+22698 745 632,02 982 745",
  },
  {
    imgUrl: icon03,
    imgAlt: "contact icon",
    title: "Email",
    desc: "admin@shopcart.com",
  },
  {
    imgUrl: icon04,
    imgAlt: "contact icon",
    title: "Site web",
    desc: "www.shopcart.com",
  },
];

const Contact = () => {
  return (
    <div>
      <PageHeader title={"Contactez-nous"} curPage={"Contact"} />
      <div className="map-address-section padding-tb section-bg">
        <div className="container">
          <div className="section-header text-center">
            <span className="subtitle">{subTitle}</span>
            <h2 className="title">{title}</h2>
          </div>
          <div className="section-wrapper">
            <div className="row flex-row-reverse">
              <div className="col-xl-4 col-lg-5 col-12">
                <div className="contact-wrapper">
                  {contactList.map((val, i) => (
                    <div className="contact-item" key={i}>
                      <div className="contact-thumb">
                        <img src={`${val.imgUrl}`} alt={`${val.imgAlt}`} />
                      </div>
                      <div className="contact-content">
                        <h6 className="title">{val.title}</h6>
                        <p>{val.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-xl-8 col-lg-7 col-12">
                <GoogleMap />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="contact-section padding-tb">
        <div className="container">
          <div className="section-header text-center">
            <span className="subtitle">{conSubTitle}</span>
            <h2 className="title">{conTitle}</h2>
          </div>
          <div className="section-wrapper">
            <form className="contact-form">
              <div className="form-group">
                <input type="text" name="name" placeholder="Votre nom *" />
              </div>
              <div className="form-group">
                <input type="text" name="email" placeholder="Votre email *" />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="number"
                  placeholder="Numéro de téléphone *"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  placeholder="Sujet *"
                />
              </div>
              <div className="form-group w-100">
                <textarea
                  rows="8"
                  type="text"
                  placeholder="Votre message"
                ></textarea>
              </div>
              <div className="form-group w-100 text-center">
                <button className="lab-btn">
                  <span>{btnText}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
