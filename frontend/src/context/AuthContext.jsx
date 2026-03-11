import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from './jwtDecode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded && decoded.sub) {
                    setUser({
                        username: decoded.sub,
                        id: decoded.user_id || null,
                    });
                } else {
                    logout();
                }
            } catch {
                logout();
            }
        }
    }, [token]);

    const login = (accessToken) => {
        localStorage.setItem('token', accessToken);
        setToken(accessToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!token && !!user;

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
