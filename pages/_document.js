// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="description"
          content="Boutique en ligne de produits de qualité"
        />
        <link rel="icon" href="/favicon.ico" />

        {/* ← CDN bootstrap-icons */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css"
        />
        
        {/* 
          Note: La plupart des styles sont maintenant importés dans _app.js
          Nous gardons ici uniquement les CDN et les styles qui doivent être
          chargés avant le rendu initial
        */}
        
        {/* Styles externes essentiels */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
          integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}