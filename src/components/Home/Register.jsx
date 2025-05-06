const subTitle = "À ne pas manquer";
const title = (
  <h2 className="title">
    Participez à notre atelier gratuit sur <b>les techniques</b>{" "}
    <span className="yellow-color">avancées</span> <b>de vente</b>
  </h2>
);
const desc = "Offre à durée limitée ! Dépêchez-vous";
const regTitle = "Inscrivez-vous maintenant";
const btnText = "S'inscrire";

const Register = () => {
  return (
    <section className="register-section padding-tb pb-0">
      <div className="container">
        <div className="row g-4 row-cols-lg-2 row-cols-1 align-items-center">
          <div className="col">
            <div className="section-header">
              <span className="subtitle">{subTitle}</span>
              {title}
              <p>{desc}</p>
            </div>
          </div>
          <div className="col">
            <div className="section-wrapper">
              <h4>{regTitle}</h4>
              <form className="register-form">
                <input
                  type="text"
                  name="name"
                  placeholder="Nom d'utilsateur"
                  className="reg-input"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="reg-input"
                />
                <input
                  type="text"
                  name="number"
                  placeholder="Téléphone"
                  className="reg-input"
                />
                <button type="submit" className="lab-btn">
                  <span>{btnText}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
