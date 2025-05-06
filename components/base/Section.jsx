import React from 'react';
import { Container } from 'react-bootstrap';
import classNames from 'classnames';

// Composant de base Section réutilisable pour structurer la mise en page
// Utilisé comme wrapper pour différentes sections du site
const Section = ({
  as: Component = 'section',
  fluid = false,
  children,
  className,
  small,
  ...rest
}) => {
  return (
    <Component
      className={classNames(className, {
        'py-8': !small,
        'py-4': small
      })}
      {...rest}
    >
      <Container fluid={fluid}>{children}</Container>
    </Component>
  );
};

export default Section;
