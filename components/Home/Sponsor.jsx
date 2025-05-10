import { useEffect, useState } from 'react';
import axios from 'axios';

// Style personnalisé pour le carrousel des sponsors
const sponsorStyle = {
    sponsorSection: {
        padding: '30px 0',
        backgroundColor: '#f8f9fa'
    },
    sectionTitle: {
        textAlign: 'center',
        marginBottom: '25px',
        fontSize: '24px',
        fontWeight: '600',
        color: '#333'
    },
    sponsorSlider: {
        padding: '10px 0'
    },
    sponsorItem: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '15px',
        transition: 'all 0.3s ease'
    },
    sponsorThumb: {
        textAlign: 'center',
        filter: 'grayscale(100%)',
        opacity: '0.7',
        transition: 'all 0.3s ease',
        transform: 'scale(0.9)',
        maxWidth: '100%',
        height: 'auto'
    },
    sponsorThumbHover: {
        filter: 'grayscale(0%)',
        opacity: '1',
        transform: 'scale(1)'
    },
    loadingState: {
        textAlign: 'center',
        padding: '30px',
        color: '#666',
        fontStyle: 'italic',
        fontSize: '16px'
    }
};

// Liste des sponsors de secours (au cas où l'API est indisponible)
const fallbackSponsors = [
    { imageUrl: '/assets/images/sponsor/ile.png', name: 'ile', _id: 'fallback-1' },
    { imageUrl: '/assets/images/sponsor/nestle.png', name: 'Nestlé', _id: 'fallback-2' },
    { imageUrl: '/assets/images/sponsor/disney.png', name: 'Disney', _id: 'fallback-3' },
    { imageUrl: '/assets/images/sponsor/airbnb.png', name: 'airbnb', _id: 'fallback-4' },
    { imageUrl: '/assets/images/sponsor/grab.png', name: 'Grab', _id: 'fallback-5' },
    { imageUrl: '/assets/images/sponsor/netflix.png', name: 'Netflix', _id: 'fallback-6' }
];

const Sponsor = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [usingFallbacks, setUsingFallbacks] = useState(false);
    
    // Récupération des sponsors depuis l'API
    useEffect(() => {
        let isMounted = true;
        let timeoutId = null;
        
        const fetchSponsors = async () => {
            try {
                if (isMounted) setLoading(true);
                
                // Augmenter le timeout pour donner plus de temps au chargement
                const controller = new AbortController();
                timeoutId = setTimeout(() => controller.abort(), 5000);

                try {
                    const { data } = await axios.get('/api/sponsor-banners', {
                        signal: controller.signal,
                        timeout: 5000 // Timeout plus long pour Axios
                    });
                    
                    if (!isMounted) return;
                    clearTimeout(timeoutId);
                    
                    // Filtrer uniquement les sponsors actifs
                    const activeSponsors = data.filter(sponsor => sponsor.isActive);
                    // Trier par ordre
                    const sortedSponsors = activeSponsors.sort((a, b) => a.order - b.order);
                    
                    if (sortedSponsors.length > 0) {
                        setSponsors(sortedSponsors);
                        setUsingFallbacks(false);
                        setError(false);
                    } else {
                        console.log('Aucun sponsor actif trouvé dans la base de données, utilisation des sponsors de secours');
                        if (isMounted) {
                            setSponsors(fallbackSponsors);
                            setUsingFallbacks(true);
                        }
                    }
                } catch (fetchError) {
                    // Ignorer les erreurs d'annulation (c'est normal)
                    if (fetchError.name === 'CanceledError' || fetchError.name === 'AbortError') {
                        console.log('Requête de sponsors annulée, utilisation des sponsors de secours');
                    } else {
                        console.error('Erreur lors de la récupération des sponsors:', fetchError);
                    }
                    
                    if (!isMounted) return;
                    
                    // Si l'API échoue, utiliser immédiatement les sponsors de secours
                    setSponsors(fallbackSponsors);
                    setUsingFallbacks(true);
                    setError(true);
                    
                    // Ne pas tenter d'ajouter les sponsors en cas d'erreur, 
                    // ce qui pourrait causer plus de problèmes
                }
            } catch (err) {
                if (!isMounted) return;
                console.error('Erreur globale dans fetchSponsors:', err);
                setSponsors(fallbackSponsors);
                setUsingFallbacks(true);
                setError(true);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchSponsors();
        
        // Nettoyage pour éviter les mises à jour sur un composant démonté
        return () => {
            isMounted = false;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);
    
    // Log pour faciliter le débogage
    useEffect(() => {
        if (usingFallbacks) {
            console.log('Utilisation des sponsors de secours locaux');
        }
    }, [usingFallbacks]);

    // Toujours afficher la section, même si on utilise les sponsors de secours
    useEffect(() => {
        // Si après 3 secondes on n'a toujours pas de sponsors, utiliser les fallbacks
        const fallbackTimer = setTimeout(() => {
            if (sponsors.length === 0 && loading) {
                setSponsors(fallbackSponsors);
                setUsingFallbacks(true);
                setLoading(false);
                console.log('Utilisation des sponsors de secours après timeout');
            }
        }, 3000);
        
        return () => clearTimeout(fallbackTimer);
    }, [sponsors.length, loading]);

    return (
        <div style={sponsorStyle.sponsorSection} className="sponsor-section">
            <div className="container">
                <div className="section-wrapper">
                    <h3 style={sponsorStyle.sectionTitle}>Nos partenaires</h3>
                    <div style={sponsorStyle.sponsorSlider} className="sponsor-slider">
                        {loading ? (
                            <div style={sponsorStyle.loadingState}>Chargement des partenaires...</div>
                        ) : (
                            <div className="sponsor-ticker" style={{ overflow: 'hidden', position: 'relative' }}>
                                <div className="sponsor-track" style={{ 
                                    display: 'flex',
                                    width: 'max-content',
                                    animation: 'ticker 20s linear infinite'
                                }}>
                                    {/* Répéter les sponsors pour un défilement infini */}
                                    {sponsors.length > 0 ? (
                                        [...sponsors, ...sponsors].map((sponsor, i) => (
                                            <div 
                                                key={`${sponsor._id || sponsor.name || i}-${i}`}
                                                style={{
                                                    ...sponsorStyle.sponsorItem,
                                                    minWidth: '160px',
                                                    margin: '0 15px',
                                                    flex: '0 0 auto'
                                                }} 
                                                className="sponsor-item"
                                                onMouseEnter={() => setHoveredIndex(i)}
                                                onMouseLeave={() => setHoveredIndex(null)}
                                            >
                                                <a 
                                                    href={sponsor.link || '#'} 
                                                    target={sponsor.link ? "_blank" : "_self"}
                                                    rel="noopener noreferrer"
                                                    style={{ display: 'block' }}
                                                >
                                                    <div className="sponsor-thumb">
                                                        <img 
                                                            style={{
                                                                ...sponsorStyle.sponsorThumb,
                                                                ...(hoveredIndex === i ? sponsorStyle.sponsorThumbHover : {})
                                                            }}
                                                            src={sponsor.imageUrl} 
                                                            alt={sponsor.name || 'Sponsor'} 
                                                            width="140" 
                                                            height="60"
                                                            onError={(e) => {
                                                                // Remplacer les images cassées par une image de substitution
                                                                e.target.onerror = null;
                                                                e.target.src = '/assets/images/placeholder.jpg';
                                                            }}
                                                        />
                                                    </div>
                                                </a>
                                            </div>
                                        ))
                                    ) : (
                                        // Afficher un message si aucun sponsor n'est disponible
                                        (<div style={{ padding: '20px', textAlign: 'center' }}>Nos partenaires seront bientôt disponibles
                                                                                    </div>)
                                    )}
                                </div>
                                
                                <style jsx>{`
                                    @keyframes ticker {
                                        0% { transform: translateX(0); }
                                        100% { transform: translateX(-50%); }
                                    }
                                    
                                    .sponsor-track:hover {
                                        animation-play-state: paused;
                                    }
                                `}</style>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default Sponsor;
