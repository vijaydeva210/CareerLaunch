import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
});

// --- 1. THE REQUEST INTERCEPTOR ---
api.interceptors.request.use(
    (config) => {
        // FIXED: Matched the exact key we used in Login.jsx
        const token = localStorage.getItem('access'); 
        if (token) {
            // FIXED: Used backticks for template literals so the token actually injects
            config.headers.Authorization = `Bearer ${token}`; 
        }
        return config;
    }, 
    (error) => {
        return Promise.reject(error);
    }
);

// --- 2. THE RESPONSE INTERCEPTOR (The Silent Refresh Engine) ---
// Catches 401 Unauthorized errors and silently gets a new token
api.interceptors.response.use(
    (response) => {
        return response; // All good, pass the data to the UI
    },
    async (error) => {
        const originalRequest = error.config;

        // If Django says "Token Expired" (401) AND we haven't already tried to retry this exact request
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Set a flag so we don't get stuck in an infinite loop

            const refreshToken = localStorage.getItem('refresh');

            if (refreshToken) {
                try {
                    // Ask Django's token refresh door for a new 5-minute key
                    const response = await axios.post('http://127.0.0.1:8000/api/accounts/token/refresh/', {
                        refresh: refreshToken
                    });

                    // Save the brand new token to memory
                    localStorage.setItem('access', response.data.access);
                    
                    // Attach the new token to the original request that failed
                    originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                    
                    // Fire the request again!
                    return api(originalRequest);
                } catch (refreshError) {
                    // The 24-hour refresh token is ALSO dead. Hard logout.
                    localStorage.removeItem('access');
                    localStorage.removeItem('refresh');
                    window.location.href = '/'; 
                }
            } else {
                // No refresh token exists. Hard logout.
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                window.location.href = '/';
            }
        }

        return Promise.reject(error);
    }
);

export default api;