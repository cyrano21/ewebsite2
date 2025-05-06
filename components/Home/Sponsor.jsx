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
        const fetchSponsors = async () => {
            try {
                setLoading(true);
                
                // Ajouter un timeout pour éviter que la requête ne bloque trop longtemps
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                try {
                    const { data } = await axios.get('/api/sponsor-banners', {
                        signal: controller.signal
                    });
                    
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
                        setSponsors(fallbackSponsors);
                        setUsingFallbacks(true);
                    }
                } catch (fetchError) {
                    // Si l'API échoue, utiliser immédiatement les sponsors de secours
                    console.error('Erreur lors de la récupération des sponsors:', fetchError);
                    setSponsors(fallbackSponsors);
                    setUsingFallbacks(true);
                    setError(true);
                    
                    // Tenter d'ajouter les sponsors de secours en arrière-plan (sans attendre)
                    try {
                        // Vérifier d'abord si l'API est accessible
                        const testResponse = await fetch('/api/sponsor-banners', { 
                            method: 'HEAD',
                            cache: 'no-store'
                        });
                        
                        if (testResponse.ok) {
                            console.log('L\'API est accessible, tentative d\'ajout des sponsors de secours...');
                            // Ne pas attendre l'ajout des sponsors (exécution en arrière-plan)
                            fallbackSponsors.forEach(async (sponsor, index) => {
                                try {
                                    await axios.post('/api/sponsor-banners', {
                                        name: sponsor.name,
                                        imageUrl: sponsor.imageUrl,
                                        isActive: true,
                                        order: index
                                    });
                                } catch (postError) {
                                    console.error(`Échec de l'ajout du sponsor ${sponsor.name}:`, postError);
                                }
                            });
                        }
                    } catch (testError) {
                        console.log('API inaccessible, utilisation des sponsors de secours locaux');
                    }
                }
            } catch (err) {
                console.error('Erreur globale dans fetchSponsors:', err);
                setSponsors(fallbackSponsors);
                setUsingFallbacks(true);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchSponsors();
    }, []);
    
    // Log pour faciliter le débogage
    useEffect(() => {
        if (usingFallbacks) {
            console.log('Utilisation des sponsors de secours locaux');
        }
    }, [usingFallbacks]);

    // Ne pas afficher la section si aucun sponsor n'est disponible
    if (sponsors.length === 0 && !loading) {
        return null;
    }

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
                                    {[...sponsors, ...sponsors].map((sponsor, i) => (
                                        <div 
                                            key={`${sponsor._id || i}-${i}`}
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
                                                        alt={sponsor.name} 
                                                        width="140" 
                                                        height="60"
                                                    />
                                                </div>
                                            </a>
                                        </div>
                                    ))}
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
