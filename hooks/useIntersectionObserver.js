import { useEffect, useState, useRef } from 'react';

/**
 * Hook personnalisé pour observer quand un élément devient visible dans la fenêtre d'affichage
 * @param {Object} options - Options pour l'IntersectionObserver
 * @param {number} options.threshold - Seuil de visibilité (entre 0 et 1)
 * @param {string} options.root - Élément qui sert de zone d'affichage
 * @param {string} options.rootMargin - Marge autour de la zone d'affichage
 * @returns {Array} - [ref, isVisible, entry] où ref est la référence à attacher à l'élément, 
 *                   isVisible indique si l'élément est visible, et entry est l'objet IntersectionObserverEntry
 */
const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [entry, setEntry] = useState(null);
  const elementRef = useRef(null);
  const observerRef = useRef(null);

  const { threshold = 0.1, root = null, rootMargin = '0px' } = options;

  useEffect(() => {
    // Nettoyer l'observer précédent
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Créer un nouvel observer
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        setEntry(entry);
      },
      { threshold, root, rootMargin }
    );

    // Observer l'élément actuel
    const currentElement = elementRef.current;
    if (currentElement) {
      observerRef.current.observe(currentElement);
    }

    // Nettoyer l'observer lorsque le composant est démonté
    return () => {
      if (observerRef.current && currentElement) {
        observerRef.current.unobserve(currentElement);
        observerRef.current.disconnect();
      }
    };
  }, [threshold, root, rootMargin]);

  return [elementRef, isVisible, entry];
};

export default useIntersectionObserver;
