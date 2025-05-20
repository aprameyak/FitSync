'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = Cookies.get('token');
        if (token) {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (err) {
                Cookies.remove('token');
                setUser(null);
            }
        }
        setLoading(false);
    };

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                email,
                password
            });
            const { token, user } = response.data;
            Cookies.set('token', token, { expires: 7 }); // 7 days expiry
            setUser(user);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
            throw err;
        }
    };

    const signup = async (email: string, password: string, name: string) => {
        try {
            setError(null);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
                email,
                password,
                name
            });
            const { token, user } = response.data;
            Cookies.set('token', token, { expires: 7 });
            setUser(user);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Signup failed');
            throw err;
        }
    };

    const logout = () => {
        Cookies.remove('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 