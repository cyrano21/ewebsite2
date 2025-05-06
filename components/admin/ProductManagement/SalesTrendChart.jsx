
import React, { useMemo } from 'react';
import { Card } from 'react-bootstrap';
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
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesTrendChart = ({ salesData = [] }) => {
  // Vérifier si les données sont disponibles et les préparer pour le graphique
  const chartData = useMemo(() => {
    if (!salesData || !Array.isArray(salesData) || salesData.length === 0) {
      // Données par défaut si aucune donnée n'est fournie
      return {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'],
        datasets: [
          {
            label: 'Ventes',
            data: [0, 0, 0, 0, 0, 0, 0],
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            tension: 0.4,
          },
        ],
      };
    }

    // Si les données sont disponibles, les utiliser
    return {
      labels: salesData.map(item => item.month || item.date || ''),
      datasets: [
        {
          label: 'Ventes',
          data: salesData.map(item => item.amount || item.sales || 0),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.4,
        },
      ],
    };
  }, [salesData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card className="h-100 shadow-sm">
      <Card.Header className="bg-white border-0 pt-4 pb-0">
        <h6 className="mb-0">Tendance des ventes</h6>
      </Card.Header>
      <Card.Body>
        <div style={{ height: '250px' }}>
          <Line options={options} data={chartData} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default SalesTrendChart;
