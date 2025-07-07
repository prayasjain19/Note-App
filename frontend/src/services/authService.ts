import axios from 'axios';

const API = 'http://localhost:5000/api/auth';

export const authService = {
    signup: (data: { name: string; email: string; dateOfBirth: string }) =>
        axios.post(`${API}/signup`, data),

    verifyOtp: (data: { email: string; otp: string }) =>
        axios.post(`${API}/verify-otp`, data),

    signin: (data: { email: string }) =>
        axios.post(`${API}/signin`, data),

    googleLogin: (data: { token: string }) =>
        axios.post('http://localhost:5000/api/auth/google-login', data),
};
