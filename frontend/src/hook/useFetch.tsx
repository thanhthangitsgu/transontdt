import { useEffect, useState } from "react";
import AxiosAuth from "../api/AxiosAuth";
import AxiosClient from "../api/AxiosClient";
import { HTTP } from "../utils/DataType";

export default function useFetch(url: string, authen: boolean, method: HTTP, data?: Object) {
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const fetchData = () => {
            let axios = authen ? AxiosAuth : AxiosClient;

            let config = data ? {
                url: url,
                method: method,
                data: data
            } : {
                url: url,
                method: method,
            };

            axios(config).then((res) => {
                setResponse(res);
                setLoading(false);
                setMessage('Success');
            }).catch((e) => setMessage(e));;
        };

        fetchData();

    }, [url]);

    return {data, loading, message};

}