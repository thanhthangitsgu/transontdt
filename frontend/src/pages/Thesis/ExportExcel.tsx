import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { read, utils, writeFileXLSX } from 'xlsx';

type props = {
    data: any[]
}

export default function ExportExcel({ data }: props) {
    const [pres, setPres] = useState<any[]>([]);
    useEffect(() => {
        setPres(data);
    }, [data]);

    return (
        <button >Export XLSX</button>
    );
}