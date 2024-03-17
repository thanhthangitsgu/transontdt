import axios from "axios";

const AxiosClient = axios.create({
    baseURL: 'https://www.api.sguscheduling.xoaiiweb.com/api',
    // baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-type': 'application/json',
        'Accept': '*',
        'authorization': 'Bearer' + localStorage.getItem('sgu_token')
    },
});

export default AxiosClient;