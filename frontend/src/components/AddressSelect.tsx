import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

type props = {
    textAddress: string,
    setAddress: Function,
    disabled: boolean
}

type Province = {
    full_name: string,
    id: number,
    name: string,
    name_en: string,
    region_id: number,
    type: string
}

type District = {
    full_name: string,
    id: number,
    name: string,
    name_en: string,
    type: string
}

type Ward = {
    full_name: string,
    id: number,
    name: string,
    name_en: string,
    type: string
}

type SelectAddress = {
    province: string,
    district: string,
    ward: string
}
export default function AddressSelect({ textAddress, setAddress, disabled }: props) {
    const baseURL = 'https://vnprovinces.pythonanywhere.com/api/';
    const [listProvince, setListProvince] = useState<Province[]>([]);
    const [listDistrict, setListDistrict] = useState<District[]>([]);
    const [listWard, setListWard] = useState<Ward[]>([]);
    const [select, setSelect] = useState<SelectAddress>({ province: '', district: '', ward: '' });

    useEffect(() => {
        setSelect({
            province: splitAddress(textAddress)[0],
            district: splitAddress(textAddress)[1],
            ward: splitAddress(textAddress)[2]
        });

        console.log(textAddress);

    }, [textAddress])

    useEffect(() => {
        fetchListProvince();
    }, []);

    useEffect(() => {
        let item = listProvince.find((item) => item.name === select.province);
        setListDistrict([]);
        if (item !== undefined) fetchListDistrict(item.id);
    }, [select.province, listProvince]);

    useEffect(() => {
        let item = listDistrict.find((item) => item.name === select.district);
        setListWard([]);
        if (item !== undefined) fetchListWard(item.id);
        else listDistrict.length && setSelect({ ...select, district: listDistrict[0].name });

    }, [select.district, listDistrict]);

    useEffect(() => {
        let item = listWard.find((item) => item.name === select.ward);
        if (!item) listWard.length && setSelect({ ...select, ward: listWard[0].name });
    }, [listWard])

    function fetchListProvince(): void {
        axios.get(`${baseURL}provinces/?basic=true&limit=100`).then((data) => {
            let dataProvince = data.data.results
            setListProvince(dataProvince);
        })
    }

    function fetchListDistrict(id: number): void {
        axios.get(`${baseURL}provinces/${id}`).then((data) => {
            let dataDistrict: any[] = data.data.districts;
            setListDistrict(dataDistrict);
        })
    }

    function fetchListWard(id: number): void {
        axios.get(`${baseURL}/districts/${id}`).then((data) => {
            let dataWard = data.data.wards;
            setListWard(dataWard);
        })
    }

    function splitAddress(address: string): string[] {
        return address.split('-');
    }

    function valueProvince(): string {
        if (select.province.length > 0 && listProvince.length) return select.province;
        return 'loading...';
    }

    function valueDistrict(): string {
        if (select.district && select.district.length > 0 && listDistrict.length) return select.district;
        return 'loading...';
    }

    function valueWard(): string {
        if (select.ward && select.ward.length > 0 && listWard.length) return select.ward;
        return 'loading...';
    }

    function onChangeProvince(event: SelectChangeEvent<string>): void {
        setSelect({ ...select, province: event.target.value, district: 'loading...', ward: 'loading...' });
        setListDistrict([]);
        setListWard([]);
    }

    function onChangeDistrict(event: SelectChangeEvent<string>): void {
        console.log('check');

        setSelect({ ...select, district: event.target.value, ward: 'loading...' });
        setListWard([]);
    }

    function onChangeWard(event: SelectChangeEvent<string>): void {
        setSelect({ ...select, ward: event.target.value })
    }

    useEffect(() => {
        setAddress(`${select.province}-${select.district}-${select.ward}`);
        console.log(select);
    }, [select])

    return (
        <div className="address-select">
            <div className="flex gap-4">
                <FormControl fullWidth size="small" >
                    <InputLabel>Tỉnh/TP</InputLabel>
                    <Select label="Tỉnh/TP" value={valueProvince()} onChange={onChangeProvince} disabled={disabled}>
                        {listProvince.length && listProvince.map((item, index) => <MenuItem key={index} value={item.name}>{item.name}</MenuItem>)}
                        {!listProvince.length && (<MenuItem value={'loading...'}>Loading...</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                    <InputLabel>Huyện/Quận</InputLabel>
                    <Select label="Huyện/Quận" value={valueDistrict()} onChange={onChangeDistrict} disabled={disabled}>
                        {listDistrict.length && listDistrict.map((item, index) => <MenuItem key={index} value={item.name}>{item.name}</MenuItem>)}
                        {!listDistrict.length && (<MenuItem value={'loading...'}>Loading...</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                    <InputLabel>Xã/Phường</InputLabel>
                    <Select
                        value={valueWard()}
                        label="Xã/Phường"
                        onChange={onChangeWard}
                        disabled={disabled}
                    >
                        {listWard.length && listWard.map((item, index) => <MenuItem key={index} value={item.name}>{item.name}</MenuItem>)}
                        {!listWard.length && (<MenuItem value={'loading...'}>Loading...</MenuItem>)}
                    </Select>
                </FormControl>
            </div>
        </div>
    )
}