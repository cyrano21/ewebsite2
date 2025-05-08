
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import dynamic from 'next/dynamic';

// Importer Chart.js de manière dynamique et l'initialiser uniquement côté client
const ChartComponent = dynamic(
  () => import('./ChartInit').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className="text-center py-3">Chargement du graphique...</div>
  }
);

const SalesChart = ({ data = [] }) => {
  const [period, setPeriod] = useState('week');
  const [chartData, setChartData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Déterminer si on est côté client
  useEffect(() => {
    setIsClient(true);
    // Log de débogage seulement côté client
    console.log('SalesChart - données reçues:', data);
  }, [data]);
  
  // Préparer les données pour le graphique en fonction de la période avec useCallback
  const prepareChartData = useCallback(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log('SalesChart - Aucune donnée disponible ou format incorrect');
      setChartData(null);
      return;
    }
    
    // Indiquer que le traitement des données est en cours
    setIsProcessing(true);
    
    try {
    
    // Formatage des labels et des données selon la période
    let labels = [];
    let salesData = [];
    let ordersData = [];

    if (period === 'week') {
      // Données pour la semaine - 7 derniers jours
      const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      const weekData = data.slice(-7);
      
      labels = weekData.map(item => days[new Date(item.date).getDay()]);
      salesData = weekData.map(item => item.sales);
      ordersData = weekData.map(item => item.orders);
    } else if (period === 'month') {
      // Données pour le mois - 30 derniers jours, groupés par semaine
      const monthData = data.slice(-30);
      const weeks = {};
      
      monthData.forEach(item => {
        const date = new Date(item.date);
        const weekNumber = Math.ceil((date.getDate()) / 7);
        const weekKey = `Semaine ${weekNumber}`;
        
        if (!weeks[weekKey]) {
          weeks[weekKey] = { sales: 0, orders: 0 };
        }
        
        weeks[weekKey].sales += item.sales;
        weeks[weekKey].orders += item.orders;
      });
      
      labels = Object.keys(weeks);
      salesData = labels.map(week => weeks[week].sales);
      ordersData = labels.map(week => weeks[week].orders);
    } else {
      // Données pour l'année - 12 derniers mois
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
      const yearData = {};
      
      data.forEach(item => {
        const date = new Date(item.date);
        const monthKey = months[date.getMonth()];
        
        if (!yearData[monthKey]) {
          yearData[monthKey] = { sales: 0, orders: 0 };
        }
        
        yearData[monthKey].sales += item.sales;
        yearData[monthKey].orders += item.orders;
      });
      
      labels = months;
      salesData = labels.map(month => yearData[month]?.sales || 0);
      ordersData = labels.map(month => yearData[month]?.orders || 0);
    }

    console.log('SalesChart - données préparées:', { labels, salesData, ordersData });

    // Configuration du graphique
    setChartData({
      labels,
      datasets: [
        {
          label: 'Ventes (€)',
          data: salesData,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          yAxisID: 'y',
        },
        {
          label: 'Commandes',
          data: ordersData,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          yAxisID: 'y1',
        },
      ],
    });
    } catch (error) {
      console.error('Erreur lors de la préparation des données:', error);
      
      // En cas d'erreur, créer un jeu de données par défaut pour éviter le chargement infini
      setChartData({
        labels: ['Données non disponibles'],
        datasets: [
          {
            label: 'Ventes (€)',
            data: [0],
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            yAxisID: 'y',
          },
          {
            label: 'Commandes',
            data: [0],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            yAxisID: 'y1',
          },
        ],
      });
    } finally {
      setIsProcessing(false);  // Fin du traitement
    }
  }, [data, period]);
  
  // Appeler prepareChartData quand les données ou la période changent
  useEffect(() => {
    prepareChartData();
  }, [prepareChartData]);
  
  // Assurer qu'un état de fallback est toujours disponible après quelques secondes
  useEffect(() => {
    if (!isClient) return; // Ne pas exécuter côté serveur
    
    const timer = setTimeout(() => {
      if (!chartData) {
        console.log('SalesChart - Timeout atteint, affichage du fallback');
        // Définir un jeu de données par défaut si aucune donnée n'est disponible après 3 secondes
        setChartData({
          labels: ['Données non disponibles'],
          datasets: [
            {
              label: 'Ventes (€)',
              data: [0],
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
              yAxisID: 'y',
            },
            {
              label: 'Commandes',
              data: [0],
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              yAxisID: 'y1',
            },
          ],
        });
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [chartData, isClient]);

  // Options du graphique
  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: false,
      },
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Ventes (€)',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Commandes',
        },
      },
    },
  };

  // Afficher un message si aucune donnée n'est disponible
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="icofont-chart-line fs-1 text-muted"></i>
        <p className="mt-3 text-muted">Aucune donnée de vente disponible</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <ButtonGroup size="sm">
          <Button 
            variant={period === 'week' ? 'primary' : 'outline-primary'}
            onClick={() => setPeriod('week')}
          >
            Semaine
          </Button>
          <Button 
            variant={period === 'month' ? 'primary' : 'outline-primary'}
            onClick={() => setPeriod('month')}
          >
            Mois
          </Button>
          <Button 
            variant={period === 'year' ? 'primary' : 'outline-primary'}
            onClick={() => setPeriod('year')}
          >
            Année
          </Button>
        </ButtonGroup>
      </div>
      
      <div style={{ height: '300px' }}>
        {chartData ? (
          <ChartComponent data={chartData} options={options} />
        ) : (
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="text-center">
              <div className="spinner-border text-primary mb-2" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="text-muted">Chargement des données...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesChart;
