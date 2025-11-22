import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
    user: string | null;
    role: string | null;
    token: string | null;
    login: (token: string, username: string, role: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<string | null>(localStorage.getItem('username'));
    const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const login = (newToken: string, newUsername: string, newRole: string) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('username', newUsername);
        localStorage.setItem('role', newRole);
        setToken(newToken);
        setUser(newUsername);
        setRole(newRole);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        setToken(null);
        setUser(null);
        setRole(null);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ user, role, token, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
