import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import Link from 'next/link';
import PropTypes from 'prop-types';

/**
 * Composant de fil d'Ariane pour la navigation
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.items - Liste des éléments du fil d'Ariane
 * @param {string} props.className - Classes CSS additionnelles
 * @returns {React.ReactElement}
 */
const PageBreadcrumb = ({ items, className = '', ...rest }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className={`mb-0 ${className}`} {...rest}>
      {items.map((item, index) => (
        <Breadcrumb.Item 
          key={index} 
          active={item.active}
          linkAs={item.href && !item.active ? 'span' : undefined}
        >
          {item.href && !item.active ? (
            <Link href={item.href}>
              {item.label}
            </Link>
          ) : (
            item.label
          )}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

// Définition des PropTypes pour la validation des props
PageBreadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      active: PropTypes.bool
    })
  ).isRequired,
  className: PropTypes.string
};

export default PageBreadcrumb;