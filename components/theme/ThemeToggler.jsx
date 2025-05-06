import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import styles from './ThemeToggler.module.css';

const ThemeToggler = ({ 
  className = '', 
  variant = 'icon', // 'icon', 'switch', 'select'
  position = 'right', // 'left', 'right', 'center'
  onThemeChange = null
}) => {
  const [theme, setTheme] = useState('light');
  
  // Charger le thème au démarrage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);
  
  // Appliquer le thème au document
  const applyTheme = (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    document.body.className = newTheme === 'dark' ? 'dark-mode' : '';
    localStorage.setItem('theme', newTheme);
    
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };
  
  // Changer de thème
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
  };
  
  // Changer de thème (version select)
  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    applyTheme(newTheme);
  };
  
  // Rendu conditionnel en fonction de la variante
  const renderThemeToggler = () => {
    switch (variant) {
      case 'switch':
        return (
          <Form.Check 
            type="switch"
            id="theme-switch"
            checked={theme === 'dark'}
            onChange={toggleTheme}
            label={theme === 'dark' ? 'Mode sombre' : 'Mode clair'}
            className={styles.themeSwitch}
          />
        );
        
      case 'select':
        return (
          <Form.Select 
            value={theme} 
            onChange={handleThemeChange}
            className={styles.themeSelect}
            aria-label="Sélectionner le thème"
          >
            <option value="light">Mode clair</option>
            <option value="dark">Mode sombre</option>
          </Form.Select>
        );
        
      case 'icon':
      default:
        return (
          <button 
            className={styles.themeButton} 
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
            title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          >
            {theme === 'dark' ? (
              <i className="icofont-sun-alt"></i>
            ) : (
              <i className="icofont-moon"></i>
            )}
          </button>
        );
    }
  };
  
  return (
    <div 
      className={`${styles.themeToggler} ${styles[position]} ${className}`}
    >
      {renderThemeToggler()}
    </div>
  );
};

export default ThemeToggler;