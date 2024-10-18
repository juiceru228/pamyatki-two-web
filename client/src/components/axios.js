import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://p2w.pro/api',
  withCredentials: true, 
});

export default instance;