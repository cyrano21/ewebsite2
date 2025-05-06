
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { blog09 } from '../../utils/imageImports';

const MostPopularPost = () => {
  const [popularPosts, setPopularPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        // Récupérer les articles les plus consultés (triés par nombre de vues)
        const response = await axios.get('/api/blogs?sortBy=views&sortOrder=desc&limit=4');
        
        if (response.status === 200) {
          const posts = response.data.data || response.data;
          setPopularPosts(Array.isArray(posts) ? posts : []);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des articles populaires:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPosts();
  }, []);

  // Image par défaut si l'article n'a pas d'image
  const defaultImage = '/default-blog.jpg';

  return (
    <div className="widget widget-post">
      <div className="widget-header">
        <h5 className="title">Articles Populaires</h5>
      </div>
      <ul className="widget-wrapper">
        {loading ? (
          // Afficher un indicateur de chargement
          Array(4).fill().map((_, i) => (
            <li className="d-flex flex-wrap justify-content-between" key={i}>
              <div className="post-thumb placeholder-glow">
                <div className="placeholder" style={{ width: '80px', height: '80px' }}></div>
              </div>
              <div className="post-content w-50">
                <div className="placeholder-glow">
                  <div className="placeholder col-12 mb-2"></div>
                  <div className="placeholder col-8"></div>
                </div>
              </div>
            </li>
          ))
        ) : popularPosts.length > 0 ? (
          // Afficher les articles récupérés
          popularPosts.map((post, i) => (
            <li className="d-flex flex-wrap justify-content-between" key={i}>
              <div className="post-thumb">
                <Link href={`/blog/${post._id || post.id}`}>
                  <img 
                    src={post.image || defaultImage} 
                    alt={post.title} 
                    width="80" 
                    height="80" 
                    style={{ objectFit: 'cover' }}
                  />
                </Link>
              </div>
              <div className="post-content">
                <Link href={`/blog/${post._id || post.id}`}>
                  <h6>{post.title}</h6>
                </Link>
                <p>{new Date(post.date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</p>
              </div>
            </li>
          ))
        ) : (
          // Afficher des articles par défaut si aucun n'est trouvé
          <li className="text-center py-3">
            <p>Aucun article populaire disponible pour le moment.</p>
          </li>
        )}
      </ul>
    </div>
  );
}

export default MostPopularPost;
