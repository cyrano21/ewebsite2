import React, { forwardRef } from "react";
import { Offcanvas as BootstrapOffcanvas } from "react-bootstrap";

/**
 * Wrapper pour le composant Offcanvas de react-bootstrap
 * qui évite les problèmes de déprécation avec element.ref dans React 19
 */
const Offcanvas = forwardRef((props, ref) => {
  return <BootstrapOffcanvas {...props} ref={ref} />;
});

// Ajout des sous-composants de Offcanvas pour maintenir l'API complète
Offcanvas.Body = BootstrapOffcanvas.Body;
Offcanvas.Header = BootstrapOffcanvas.Header;
Offcanvas.Title = BootstrapOffcanvas.Title;

Offcanvas.displayName = "OffcanvasWrapper";

export default Offcanvas;
