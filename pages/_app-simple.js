import "../src/App.css";
import "../src/index.css";
import Head from "next/head";

console.log("_app-simple.js: Début du chargement");

// bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/assets/css/bootstrap-fixes.css";

// fonts and icons
import "../src/assets/css/icofont.min.css";
import "../src/assets/css/animate.css";
import "../src/assets/css/style.min.css";
import "../src/assets/css/admin.css";

// Font Awesome
import "@fortawesome/fontawesome-free/css/all.min.css";

import { useEffect } from "react";

function SimpleApp({ Component, pageProps }) {
  console.log("_app-simple.js: Initialisation du composant SimpleApp");

  // Charger Bootstrap JS côté client uniquement
  useEffect(() => {
    console.log("_app-simple.js: useEffect - chargement de Bootstrap JS");
    import("bootstrap/dist/js/bootstrap.min.js");
  }, []);

  return (
    <>
      {console.log("_app-simple.js: Début du rendu")}
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {console.log("_app-simple.js: Avant rendu du Component")}
      <Component {...pageProps} />
      {console.log("_app-simple.js: Après rendu du Component")}
    </>
  );
}

console.log("_app-simple.js: Exportation de SimpleApp");
export default SimpleApp;
