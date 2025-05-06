
import React from 'react';
import { Container } from 'react-bootstrap';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import ProductComparison from '../components/shop/ProductComparison';

const ComparisonPage = () => {
  return (
    <Layout>
      <PageHeader title="Comparaison de Produits" curPage="Comparaison" />
      <div className="py-5">
        <Container>
          <ProductComparison />
        </Container>
      </div>
    </Layout>
  );
};

export default ComparisonPage;
