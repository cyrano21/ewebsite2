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

        {/* ← Ajoute le CDN bootstrap-icons ici */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css"
        />
        {/* Main template styles */}
        <link
          rel="stylesheet"
          href="/assets/css/style.min.css"
        />
        <link
          rel="stylesheet"
          href="/assets/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="/styles/theme.css"
        />
        <link
          rel="stylesheet"
          href="/styles/animations.css"
        />
        <link
          rel="stylesheet"
          href="/styles/responsive.css"
        />
        <link
          rel="stylesheet"
          href="/styles/banner.css"
        />
        {/* Added missing CSS files */}
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/icofont.min.css" />
        <link rel="stylesheet" href="/assets/css/animate.css" />

      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}