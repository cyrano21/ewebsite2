import React, { forwardRef } from "react";
import { Fade as BootstrapFade } from "react-bootstrap";

/**
 * Wrapper pour le composant Fade de react-bootstrap
 * qui évite les problèmes de déprécation avec element.ref dans React 19
 */
const Fade = forwardRef((props, ref) => {
  return <BootstrapFade {...props} ref={ref} />;
});

Fade.displayName = "FadeWrapper";

export default Fade;
