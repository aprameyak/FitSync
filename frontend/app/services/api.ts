const API_URL = 'http://localhost:5000';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

interface ApiError extends Error {
    status?: number;
    data?: any;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    async request(endpoint: string, options: RequestInit = {}, retryCount = 0): Promise<any> {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                ...options.headers,
            };

            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers,
            });

            if (!response.ok) {
                const error = await response.json();
                const apiError: ApiError = new Error(error.message || 'API request failed');
                apiError.status = response.status;
                apiError.data = error;
                throw apiError;
            }

            return response.json();
        } catch (error) {
            if (retryCount < MAX_RETRIES && error instanceof Error && !error.message.includes('401')) {
                await delay(RETRY_DELAY * (retryCount + 1));
                return this.request(endpoint, options, retryCount + 1);
            }
            throw error;
        }
    },

    // Auth endpoints
    auth: {
        login: (email: string, password: string) => 
            api.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            }),
        
        register: (email: string, password: string, name: string) =>
            api.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ email, password, name }),
            }),
    },

    // Profile endpoints
    profile: {
        get: (userId: string) =>
            api.request(`/profile/${userId}`),
        
        update: (userId: string, data: any) =>
            api.request(`/profile/${userId}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            }),
    },

    // Add other API endpoints as needed
    fitness: {
        getWorkouts: () => api.request('/fitness/workouts'),
        createWorkout: (data: any) => 
            api.request('/fitness/workouts', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
    },
    
    nutrition: {
        getMeals: () => api.request('/nutrition/meals'),
        createMeal: (data: any) =>
            api.request('/nutrition/meals', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
    },
    
    calories: {
        getDailyCalories: () => api.request('/calories/daily'),
        updateCalories: (data: any) =>
            api.request('/calories/daily', {
                method: 'PATCH',
                body: JSON.stringify(data),
            }),
    },
    
    media: {
        uploadMedia: (formData: FormData) =>
            api.request('/media/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    // Don't set Content-Type for FormData
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            }),
    },
    
    lift: {
        getLifts: () => api.request('/lift'),
        createLift: (data: any) =>
            api.request('/lift', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
    },
}; 