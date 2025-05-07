
// Utilitaire pour la journalisation d'activité côté client
// Cette approche complète la journalisation côté serveur en middleware

/**
 * Enregistre une activité utilisateur côté client
 * @param {Object} data - Données d'activité à enregistrer
 */
export const logActivity = async (data) => {
  try {
    // Vérifier si nous sommes côté client
    if (typeof window === 'undefined') return;
    
    // Ajouter des informations supplémentaires
    const enrichedData = {
      ...data,
      clientTimestamp: new Date().toISOString(),
      userAgent: window.navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      referrer: document.referrer || null,
      url: window.location.pathname
    };

    try {
      // Envoyer les données à notre API d'activity-log
      const response = await fetch('/api/admin/activity-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrichedData),
        // Utiliser une requête qui n'attend pas de réponse pour ne pas bloquer
        credentials: 'same-origin'
      });

      if (!response.ok) {
        console.warn('Erreur lors de l\'enregistrement de l\'activité:', response.status);
      }
    } catch (fetchError) {
      // Ignorer les erreurs de fetch pour éviter de bloquer l'UX
      console.warn('Échec de la requête d\'activité:', fetchError.message);
    }
  } catch (error) {
    // Gérer silencieusement les erreurs pour ne pas affecter l'expérience utilisateur
    console.warn('Échec de la journalisation:', error.message);
  }
};

/**
 * Enregistre une vue de page
 */
export const logPageView = () => {
  logActivity({
    type: 'page_view',
    action: 'view'
  });
};

/**
 * Enregistre un clic sur un élément
 * @param {string} elementId - ID ou description de l'élément cliqué
 * @param {string} section - Section de la page où se trouve l'élément
 */
export const logElementClick = (elementId, section = 'main') => {
  logActivity({
    type: 'interaction',
    action: 'click',
    elementId,
    section
  });
};

export default {
  logActivity,
  logPageView,
  logElementClick
};
