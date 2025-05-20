'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to sign in');
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: '#f7fafc'
            }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    width: '100%',
                    maxWidth: '400px',
                    p: 4,
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: 1
                }}
            >
                <Typography variant="h5" component="h1" gutterBottom align="center">
                    Sign In to FitSync
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    margin="normal"
                    required
                />

                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    margin="normal"
                    required
                />

                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3 }}
                >
                    Sign In
                </Button>

                <Button
                    fullWidth
                    variant="text"
                    color="primary"
                    sx={{ mt: 1 }}
                    onClick={() => router.push('/sign-up')}
                >
                    Don't have an account? Sign Up
                </Button>
            </Box>
        </Box>
    );
} 