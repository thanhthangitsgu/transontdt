import axios from "axios";

const AxiosAuth = axios.create({
     baseURL: 'https://www.api.sguscheduling.xoaiiweb.com/api',
    // baseURL: 'http://127.0.0.1:8000/api',
    timeout: 1000,
    headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
        'authorization': 'Bearer' + localStorage.getItem('sgu_token')
    }
});

export default AxiosAuth;