import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

export const logout = () => {
    setAuthToken(null);
};

class AuthService {
    async login(email, password) {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });
            
            if (response.data.token) {
                setAuthToken(response.data.token);
                return response.data;
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    isAuthenticated() {
        return !!axios.defaults.headers.common['Authorization'];
    }
}

export default new AuthService();