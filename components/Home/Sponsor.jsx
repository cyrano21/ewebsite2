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
    { imageUrl: '/assets/images/sponsor/ile.png', name: 'ile' },
    { imageUrl: '/assets/images/sponsor/nestle.png', name: 'Nestlé' },
    { imageUrl: '/assets/images/sponsor/disney.png', name: 'Disney' },
    { imageUrl: '/assets/images/sponsor/airbnb.png', name: 'airbnb' },
    { imageUrl: '/assets/images/sponsor/grab.png', name: 'Grab' },
    { imageUrl: '/assets/images/sponsor/netflix.png', name: 'Netflix' }
];

const Sponsor = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    // Récupération des sponsors depuis l'API
    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('/api/sponsor-banners');
                // Filtrer uniquement les sponsors actifs
                const activeSponsors = data.filter(sponsor => sponsor.isActive);
                // Trier par ordre
                const sortedSponsors = activeSponsors.sort((a, b) => a.order - b.order);
                setSponsors(sortedSponsors.length > 0 ? sortedSponsors : fallbackSponsors);
                setError(false);
            } catch (err) {
                console.error('Erreur lors de la récupération des sponsors:', err);
                setSponsors(fallbackSponsors); // Utiliser les sponsors de secours en cas d'erreur
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchSponsors();
    }, []);
    


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
