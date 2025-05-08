// components/seller/ChartInit.jsx
// Fichier d'initialisation de Chart.js pour le rendu côté client uniquement

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Enregistrer les composants Chart.js
try {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
} catch (error) {
  console.error('Erreur lors de l\'initialisation de Chart.js:', error);
}

// Créer un composant wrapper pour gérer les erreurs potentielles
const ChartComponent = (props) => {
  try {
    return <Line {...props} />;
  } catch (error) {
    console.error('Erreur lors du rendu du graphique:', error);
    return <div className="text-danger">Erreur d'affichage du graphique</div>;
  }
};

// Exporter le composant wrapper
export default ChartComponent;
