import axios from 'axios';

const api = axios.create({
    baseURL: 'http://10.87.169.60:3000',
    timeout: 10000,
});

export default api;