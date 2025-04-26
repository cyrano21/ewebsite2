import React, { forwardRef } from "react";
import { FormControl as BootstrapFormControl } from "react-bootstrap";

/**
 * Wrapper pour le composant FormControl de react-bootstrap
 * qui résout les problèmes d'hydratation liés aux attributs ajoutés par des extensions navigateur
 */
const FormControl = forwardRef((props, ref) => {
  // Utiliser le onChange interne pour nettoyer les attributs data-ddg ajoutés par l'extension DuckDuckGo
  const handleChange = (e) => {
    if (e.target && e.target.hasAttribute("data-ddg-inputtype")) {
      e.target.removeAttribute("data-ddg-inputtype");
    }
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return <BootstrapFormControl {...props} onChange={handleChange} ref={ref} />;
});

FormControl.displayName = "FormControlWrapper";

export default FormControl;
