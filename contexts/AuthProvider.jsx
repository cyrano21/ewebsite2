/* eslint-disable react/prop-types */
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

// Création du contexte avec des valeurs par défaut
export const AuthContext = createContext({
  user: null,
  loading: true,
  createUser: async () => {},
  login: async () => {},
  logOut: () => {},
  signUpWithGmail: async () => {}
});

// Wrapper pour s'assurer que le code sensible s'exécute uniquement côté client
const isBrowser = typeof window !== 'undefined';

const AuthProvider = ({children}) => {
    console.log('AuthProvider: Initialisation');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Fonction pour créer un nouvel utilsateur
    const createUser = async (name, email, password) => {
        console.log('AuthProvider: createUser appelé avec', name, email);

        console.log('AuthProvider: createUser appelé');
        setLoading(true);
        try {
            const response = await axios.post('/api/auth/register', {
                name,
                email,
                password
            });
            
            if (isBrowser) {
                localStorage.setItem('auth-token', response.data.token);
            }
            
            setUser(response.data.user);
            setLoading(false);
            
            return response.data;
        } catch (error) {
            setLoading(false);
            console.error('Erreur lors de la création de l\'utilsateur:', error);
            return null;
        }
    }

    // Fonction pour se connecter
    const login = async (email, password) => {
        console.log('AuthProvider: login appelé avec', email);

        console.log('AuthProvider: login appelé');
        setLoading(true);
        try {
            const response = await axios.post('/api/auth/login', {
                email,
                password
            });
            console.log('AuthProvider: réponse login', response.data);
            if (isBrowser) {
                localStorage.setItem('auth-token', response.data.token);
                console.log('AuthProvider: token stocké dans localStorage', response.data.token);
            }
            setUser(response.data.user);
            console.log('AuthProvider: setUser après login', response.data.user);
            setLoading(false);
            
            return response.data;
        } catch (error) {
            setLoading(false);
            console.error('Erreur lors de la connexion:', error);
            return null;
        }
    }

    // Fonction pour se déconnecter
    const logOut = () => {
        console.log('AuthProvider: logOut appelé');
        if (isBrowser) {
            localStorage.removeItem('auth-token');
        }
        setUser(null);
        router.push('/login');
    }

    // Fonction pour s'inscrire avec Gmail
    const signUpWithGmail = async () => {
        console.log('AuthProvider: signUpWithGmail appelé');
        // Version simplifiée
        console.log("Fonctionnalité d'inscription avec Gmail non implémentée");
        return null;
    }

    // Vérifier l'authentification au chargement - uniquement côté client
    useEffect(() => {
        console.log('AuthProvider: useEffect vérification token au démarrage');
        if (!isBrowser) {
            setLoading(false);
            return;
        }

        const checkAuth = async () => {
            console.log('AuthProvider: checkAuth appelé');
            try {
                const token = localStorage.getItem('auth-token');
                console.log('AuthProvider: token trouvé dans localStorage', token);
                
                if (token) {
                    // Configurer les en-têtes pour inclure le token
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    
                    // Vérifier la validité du token
                    try {
                        const response = await axios.get('/api/auth/me');
                        console.log('AuthProvider: user reçu via /api/auth/me', response.data);
                        setUser(response.data);
                        console.log('AuthProvider: setUser après /api/auth/me', response.data);
                    } catch (error) {
                        console.error('Erreur d\'authentification:', error);
                        localStorage.removeItem('auth-token');
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la vérification d\'authentification:', error);
            } finally {
                setLoading(false);
            }
        };
        
        checkAuth();
    }, []);

    // Créer l'objet de contexte avec les valeurs actuelles
    const authInfo = {
        user, 
        setUser,
        loading,
        createUser, 
        login, 
        logOut,
        signUpWithGmail
    };

    console.log('AuthProvider: Rendu du contexte, loading:', loading);
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
