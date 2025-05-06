import React, { useState, useEffect } from "react";
import GoogleMap from "../../components";
import PageHeader from "../../components/PageHeader";

const Contact = () => {
  const [contactInfo, setContactInfo] = useState({
    subTitle: "Contactez-nous",
    title: "Nous sommes toujours prêts à vous répondre !",
    conSubTitle: "Contactez-nous",
    conTitle: "Remplissez le formulaire ci-dessous pour que nous puissions mieux vous connaître et comprendre vos besoins.",
    btnText: "Envoyer votre message",
    contactList: [
      {
        imgUrl: "/assets/images/contact/icon/01.png",
        imgAlt: "contact icon",
        title: "Adresse",
        desc: "1201 park street, Fifth Avenue",
      },
      {
        imgUrl: "/assets/images/contact/icon/02.png",
        imgAlt: "contact icon",
        title: "Téléphone",
        desc: "+22698 745 632,02 982 745",
      },
      {
        imgUrl: "/assets/images/contact/icon/03.png",
        imgAlt: "contact icon",
        title: "Email",
        desc: "admin@shopcart.com",
      },
      {
        imgUrl: "/assets/images/contact/icon/04.png",
        imgAlt: "contact icon",
        title: "Site web",
        desc: "www.shopcart.com",
      },
    ]
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    error: null
  });

  useEffect(() => {
    // Récupérer les informations de contact depuis l'API
    const fetchContactInfo = async () => {
      try {
        const response = await fetch('/api/contact-info');
        if (response.ok) {
          const data = await response.json();
          setContactInfo(data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des informations de contact:', error);
      }
    };

    fetchContactInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ ...formStatus, isSubmitting: true, error: null });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormStatus({
          isSubmitting: false,
          isSubmitted: true,
          error: null
        });
        // Réinitialiser le formulaire après soumission réussie
        setFormData({
          name: '',
          email: '',
          number: '',
          subject: '',
          message: ''
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'envoi du message');
      }
    } catch (error) {
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        error: error.message
      });
    }
  };
  return (
    <div>
      <PageHeader title={"Contactez-nous"} curPage={"Contact"} />
      <div className="map-address-section padding-tb section-bg">
        <div className="container">
          <div className="section-header text-center">
            <span className="subtitle">{contactInfo.subTitle}</span>
            <h2 className="title">{contactInfo.title}</h2>
          </div>
          <div className="section-wrapper">
            <div className="row flex-row-reverse">
              <div className="col-xl-4 col-lg-5 col-12">
                <div className="contact-wrapper">
                  {contactInfo.contactList.map((val, i) => (
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
            <span className="subtitle">{contactInfo.conSubTitle}</span>
            <h2 className="title">{contactInfo.conTitle}</h2>
          </div>
          <div className="section-wrapper">
            <form className="contact-form" onSubmit={handleSubmit}>
              {formStatus.isSubmitted && (
                <div className="alert alert-success mb-4" role="alert">
                  Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
                </div>
              )}
              {formStatus.error && (
                <div className="alert alert-danger mb-4" role="alert">
                  {formStatus.error}
                </div>
              )}
              <div className="form-group">
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Votre nom *" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Votre email *" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="number"
                  placeholder="Numéro de téléphone *"
                  value={formData.number}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  placeholder="Sujet *"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  name="message"
                  id="message"
                  rows="8"
                  placeholder="Votre message*"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <button 
                  type="submit" 
                  className="lab-btn"
                  disabled={formStatus.isSubmitting}
                >
                  <span>{formStatus.isSubmitting ? 'Envoi en cours...' : contactInfo.btnText}</span>
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
