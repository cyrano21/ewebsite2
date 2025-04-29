// components/admin/ProductManagement/StatsOverview.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card } from 'react-bootstrap';
// Importer formatNumber depuis le fichier utils partagé
import { formatNumber } from './utils/statsUtils';

const StatsOverview = ({ stats, isLoading }) => { // Ajouter isLoading en prop

  // --- Vérification et Valeurs par Défaut ---
  // Si les stats ne sont pas prêtes (ou pendant le chargement), afficher des placeholders ou rien
  if (isLoading || !stats) {
    return (
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5 className="mb-3 placeholder-glow"><span className="placeholder col-4"></span></h5>
           <Row>
            {/* Créer 4 colonnes de placeholders */}
            {[...Array(4)].map((_, index) => (
              <Col md={3} sm={6} className="mb-3" key={index}>
                <div className="stat-card p-3 rounded bg-light border placeholder-glow">
                  <span className="placeholder col-5 d-block mb-2"></span>
                  <span className="placeholder col-8 d-block"></span>
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    );
  }

  // Utiliser des valeurs par défaut si une propriété spécifique manque
  const totalProducts = stats.totalProducts ?? 0;
  const totalStock = stats.totalStock ?? 0;
  const totalValue = stats.totalValue ?? '0.00';
  const lowStockProducts = stats.lowStockProducts ?? 0;

  return (
    <Card className="mb-4 shadow-sm"> {/* Garder la card comme conteneur */}
      <Card.Body>
        <h5 className="mb-3">Aperçu de la boutique</h5>
        <Row>
          {/* Produit Actifs */}
          <Col md={3} sm={6} className="mb-3">
            <div className="stat-card p-3 rounded bg-light-primary border">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  {/* Utiliser les variables avec valeurs par défaut */}
                  <h3 className="mb-1">{formatNumber(totalProducts)}</h3>
                  <p className="text-muted mb-0 small">Produits Actifs</p>
                </div>
                <div className="stat-icon">
                  <i className="icofont-box fs-2 text-primary opacity-75"></i>
                </div>
              </div>
            </div>
          </Col>

          {/* Articles en Stock */}
          <Col md={3} sm={6} className="mb-3">
            <div className="stat-card p-3 rounded bg-light-success border">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-1">{formatNumber(totalStock)}</h3>
                  <p className="text-muted mb-0 small">Articles en Stock</p>
                </div>
                <div className="stat-icon">
                  <i className="icofont-cubes fs-2 text-success opacity-75"></i>
                </div>
              </div>
            </div>
          </Col>

          {/* Valeur du Stock */}
          <Col md={3} sm={6} className="mb-3">
            <div className="stat-card p-3 rounded bg-light-warning border">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  {/* totalValue est déjà une string formatée */}
                  <h3 className="mb-1">{formatNumber(totalValue)}€</h3>
                  <p className="text-muted mb-0 small">Valeur du Stock</p>
                </div>
                <div className="stat-icon">
                  <i className="icofont-euro fs-2 text-warning opacity-75"></i>
                </div>
              </div>
            </div>
          </Col>

          {/* Stock Faible */}
          <Col md={3} sm={6} className="mb-3">
              <div className="stat-card p-3 rounded bg-light-danger border">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="mb-1">{formatNumber(lowStockProducts)}</h3>
                    {/* --- CORRECTION ICI --- */}
                    <p className="text-muted mb-0 small">Stock Faible (&lt;10)</p>
                    {/* ---------------------- */}
                  </div>
                  <div className="stat-icon"> <i className="icofont-warning-alt fs-2 text-danger opacity-75"></i> </div>
                </div>
              </div>
            </Col>
        </Row>
         {/* Ajouter des styles si nécessaire */}
         <style jsx>{`
            .stat-card h3 { font-weight: 600; }
            .bg-light-primary { background-color: rgba(var(--bs-primary-rgb), 0.1); }
            .bg-light-success { background-color: rgba(var(--bs-success-rgb), 0.1); }
            .bg-light-warning { background-color: rgba(var(--bs-warning-rgb), 0.1); }
            .bg-light-danger { background-color: rgba(var(--bs-danger-rgb), 0.1); }
            .stat-icon { font-size: 1.5rem; } /* Ajuster taille icône */
         `}</style>
      </Card.Body>
    </Card>
  );
};

StatsOverview.propTypes = {
  // La prop stats peut maintenant être undefined pendant le chargement
  stats: PropTypes.shape({
    totalProducts: PropTypes.number,
    totalStock: PropTypes.number,
    totalValue: PropTypes.string, // ou number si non formaté avant
    lowStockProducts: PropTypes.number,
  }),
  isLoading: PropTypes.bool // Ajouter prop isLoading
};

StatsOverview.defaultProps = {
    isLoading: false,
    stats: null // Valeur par défaut null pour indiquer qu'elle n'est peut-être pas prête
};

export default StatsOverview;