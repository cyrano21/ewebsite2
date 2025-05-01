/* eslint-disable react/prop-types */
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react'; // Importer les fonctionnalités de NextAuth

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
    
    // Utiliser la session NextAuth
    const { data: session, status } = useSession();

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
    const logOut = async () => {
        console.log('AuthProvider: logOut appelé');
        // Nettoyer localStorage
        if (isBrowser) {
            localStorage.removeItem('auth-token');
        }
        
        // Déconnexion via NextAuth
        await signOut({ redirect: false });
        
        // Mettre à jour l'état local
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

    // Synchroniser avec NextAuth session
    useEffect(() => {
        console.log('AuthProvider: useEffect vérification session NextAuth', status, session);
        
        const syncWithNextAuth = async () => {
            if (status === 'loading') {
                // Session en cours de chargement, ne rien faire
                return;
            }
            
            if (status === 'authenticated' && session?.user) {
                console.log('AuthProvider: Utilisateur authentifié via NextAuth', session.user);
                
                // Si le user n'est pas déjà défini ou s'il est différent
                if (!user || user.email !== session.user.email) {
                    try {
                        // Récupérer les données complètes de l'utilisateur
                        const response = await axios.get('/api/auth/me');
                        if (response.data && response.data.user) {
                            setUser(response.data.user);
                            console.log('AuthProvider: Utilisateur mis à jour via /api/auth/me', response.data.user);
                        } else {
                            // Utiliser les données de session si /api/auth/me ne fournit pas d'utilisateur
                            setUser(session.user);
                        }
                    } catch (error) {
                        console.error('Erreur lors de la récupération des données utilisateur:', error);
                        if (error.response && error.response.status === 401) {
                            // Si 401 Unauthorized, se déconnecter et réinitialiser l'état
                            signOut({ redirect: false });
                            setUser(null);
                        } else {
                            // Pour toute autre erreur, utiliser les données de session
                            setUser(session.user);
                        }
                    }
                }
            } else if (status === 'unauthenticated') {
                console.log('AuthProvider: Utilisateur non authentifié via NextAuth');
                setUser(null);
            }
            
            setLoading(false);
        };
        
        syncWithNextAuth();
    }, [status, session]);

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
