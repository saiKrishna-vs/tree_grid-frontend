import axios from 'axios';

const api = axios.create({
    baseURL: 'https://tree-grid-backend.onrender.com/api',
});

export default api;
