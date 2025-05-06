// contexts/AuthProvider.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSession, signOut, signIn, getSession } from 'next-auth/react';

export const AuthContext = createContext({
  user: null,
  loading: true,
  createUser: async () => {},
  login: async () => {},
  logOut: () => {},
  signUpWithGmail: async () => {}
});

const isBrowser = typeof window !== 'undefined';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { data: session, status } = useSession();

    // Fonction pour créer un utilisateur
    const createUser = async (name, email, password) => {
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
            console.error('Erreur lors de la création:', error);
            return null;
        }
    };

    // Fonction pour se connecter
    const login = async (email, password, rememberMe = false) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/auth/login', {
                email,
                password,
                rememberMe
            });

            if (isBrowser) {
                localStorage.setItem('auth-token', response.data.token);
                if (rememberMe) {
                  localStorage.setItem('rememberedUser', JSON.stringify(response.data.user));
                  localStorage.setItem('rememberedCredentials', JSON.stringify({ email, password }));
                } else {
                  localStorage.removeItem('rememberedUser');
                  localStorage.removeItem('rememberedCredentials');
                }
            }

            setUser(response.data.user);
            setLoading(false);
            return response.data;
        } catch (error) {
            setLoading(false);
            console.error('Erreur lors de la connexion:', error);
            return null;
        }
    };

    // Fonction pour se déconnecter
    const logOut = async () => {
        if (isBrowser) {
            localStorage.removeItem('auth-token');
            localStorage.removeItem('rememberedUser');
            localStorage.removeItem('rememberedCredentials');
        }

        await signOut({ redirect: false });
        setUser(null);
        router.push('/login');
    };

    // Synchroniser avec NextAuth
    useEffect(() => {
        const syncWithNextAuth = async () => {
            if (status === 'loading') return;

            if (status === 'authenticated' && session?.user) {
                // Utilisez directement les données de la session
                const userToSet = {
                    ...session.user,
                    role: session.user.role || 'user'
                };
                setUser(userToSet);
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        syncWithNextAuth();
    }, [status, session]);

    useEffect(() => {
        setLoading(true);

        // Cette fonction vérifie l'état de la session auprès de NextAuth
        const checkSession = async () => {
          try {
            const session = await getSession();

            if (session) {
              // Si une session existe déjà, mettre à jour l'état de l'utilisateur
              setUser(session.user);
            } else {
              // Essayer de récupérer l'utilisateur enregistré via localStorage
              const rememberedUser = localStorage.getItem('rememberedUser');
              if (rememberedUser) {
                // Si l'utilisateur est mémorisé, essayer de se connecter automatiquement
                // Note: on ne peut pas automatiquement se connecter avec le mot de passe car c'est sensible
                // Mais on peut afficher que l'utilisateur est "mémorisé"
                const userData = JSON.parse(rememberedUser);

                // Tenter de récupérer la session si l'utilisateur a été mémorisé
                const rememberedCredentials = localStorage.getItem('rememberedCredentials');
                if (rememberedCredentials) {
                  const { email, password } = JSON.parse(rememberedCredentials);
                  try {
                    // Tentative de connexion automatique
                    const result = await signIn('credentials', {
                      redirect: false,
                      email,
                      password
                    });

                    if (result?.ok) {
                      const newSession = await getSession();
                      if (newSession) {
                        setUser(newSession.user);
                      }
                    }
                  } catch (loginError) {
                    console.error('Erreur de connexion automatique:', loginError);
                  }
                } else {
                  // Si pas de credentials complètes, on n'est pas connecté
                  setUser(null);
                }
              } else {
                setUser(null);
              }
            }
          } catch (error) {
            console.error('Erreur lors de la vérification de la session:', error);
            setUser(null);
          } finally {
            setLoading(false);
          }
        };

        checkSession();
      }, []);


    const authInfo = { user, setUser, loading, createUser, login, logOut };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;