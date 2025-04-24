import React from "react";
console.log("index-simple.js: Création d'une page d'accueil simple");

export default function HomePage() {
  console.log("index-simple.js: Exécution du composant HomePage simple");
  return (
    <div>
      <h1>Bienvenue sur notre site</h1>
      <p>
        Cette page est une version simplifiée pour résoudre les problèmes de
        rendu.
      </p>
    </div>
  );
}
