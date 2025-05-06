import React, { createContext, useState } from 'react';

// Création du contexte avec des valeurs par défaut
export const AuthContext = createContext({
  user: null,
  loading: false,
  createUser: async () => {},
  login: async () => {},
  logOut: () => {},
  signUpWithGmail: async () => {}
});

const AuthProvider = ({children}) => {
    console.log('MinimalAuthProvider: Initialisation');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fonctions minimales sans logique réelle
    const createUser = async () => {
        console.log('MinimalAuthProvider: createUser appelé');
        return null;
    };

    const login = async () => {
        console.log('MinimalAuthProvider: login appelé');
        return null;
    };

    const logOut = () => {
        console.log('MinimalAuthProvider: logOut appelé');
    };

    const signUpWithGmail = async () => {
        console.log('MinimalAuthProvider: signUpWithGmail appelé');
    };

    // Créer l'objet de contexte avec les valeurs actuelles
    const authInfo = {
        user, 
        loading,
        createUser, 
        login, 
        logOut,
        signUpWithGmail
    };

    console.log('MinimalAuthProvider: Rendu du contexte');
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
