import { useEffect, useState } from "react";
import AxiosAuth from "../api/AxiosAuth";
import AxiosClient from "../api/AxiosClient";

export default function useGet(url: string, authen: boolean, randomReload?: number) {
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string>('');
    const [total, setTotal] = useState<number>(1);

    const fetchData = () => {
        let axios = authen ? AxiosAuth : AxiosClient;

        axios.get(url).then((response) => {
            setResponse(response.data.data);
            setLoading(false);
            setMessage('Success');
            if(response.data.total_page) setTotal(response.data.total_page);
        }).catch((e) => setMessage(e));
    };

    useEffect(() => {
        fetchData();
    }, [url]);

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, [randomReload])

    return { response, loading, message, total };
}