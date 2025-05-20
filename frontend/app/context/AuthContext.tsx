'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface User {
    id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            // Verify token and get user info
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                setUser(response.data.user);
            })
            .catch(() => {
                Cookies.remove('token');
                setUser(null);
            })
            .finally(() => {
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            email,
            password
        });
        const { token, user } = response.data;
        Cookies.set('token', token, { expires: 7 }); // Token expires in 7 days
        setUser(user);
    };

    const signup = async (email: string, password: string) => {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
            email,
            password
        });
        const { token, user } = response.data;
        Cookies.set('token', token, { expires: 7 }); // Token expires in 7 days
        setUser(user);
    };

    const logout = () => {
        Cookies.remove('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
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