import { CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import axios from "axios";
import { useEffect, useState } from "react";
import { District, Province, SelectIDProvince, TextAddress, Ward } from "../utils/DataType";
type Props = {
    disabled: boolean,
    isEdit: boolean,
    address: string,
    setAddress: Function,
    isOpen: boolean
}

export default function AddressOption({ disabled, isEdit, address, setAddress, isOpen }: Props) {
    const baseAddressURL = 'https://vnprovinces.pythonanywhere.com/api/';
    const [listProvince, setListProvince] = useState<Array<Province>>([]);
    const [listDistrict, setListDistrict] = useState<Array<District>>([]);
    const [listWard, setListWard] = useState<Array<Ward>>([]);
    const [selectID, setSelectID] = useState<SelectIDProvince>({ province: -1, district: -1, ward: -1 });
    const [textAddress, setTextAddress] = useState<string>(address)
    const [loadProvince, setLoadProvince] = useState<boolean>(false);
    const [loadDistrict, setLoadDisctrict] = useState<boolean>(false);
    const [loadWard, setLoadWard] = useState<boolean>(false);
    const [isEdited, setIsEdited] = useState<boolean>(false);

    useEffect(() => {
        fetchProvince();
    }, [textAddress]);

    useEffect(() => {
        setTextAddress(address);
    }, [address])

    useEffect(() => {
        fetchDistrict();
    }, [selectID.province]);

    useEffect(() => {
        fetchWard();
    }, [selectID.district]);

    function getSplitAddress(): string[] {
        let split = textAddress.split('-');
        return split;
    };

    //Fetch api location
    async function fetchProvince(): Promise<void> {
        setLoadProvince(true);
        let res = await axios.get(`${baseAddressURL}provinces/?basic=true&limit=100`);
        setLoadProvince(false);
        let dataProvince: Array<Province> = res.data.results;
        setListProvince(dataProvince);

        let item = dataProvince.find((item) => item.name === getSplitAddress()[0]);
        if (item) setSelectID({ ...selectID, province: item.id });
    }

    async function fetchDistrict(): Promise<void> {
        if (selectID.province < 0) return;
        setLoadDisctrict(true);
        let res = await axios.get(`${baseAddressURL}/districts/?province_id=${selectID.province}&basic=true&limit=100`);
        setLoadDisctrict(false);
        let dataDistrict: Array<District> = res.data.results;
        setListDistrict(dataDistrict);
        setSelectID({ ...selectID, district: dataDistrict[0].id });

        let item = dataDistrict.find((item) => item.name === getSplitAddress()[1]);
        if (item) setSelectID({ ...selectID, district: item.id });
    }

    async function fetchWard(): Promise<void> {
        if (selectID.district < 0) return;
        setLoadWard(true);
        let res = await axios.get(`${baseAddressURL}wards/?district_id=${selectID.district}&basic=true&limit=100`);
        setLoadWard(false);
        let dataWard: Array<Ward> = res.data.results;
        setSelectID({ ...selectID, ward: dataWard[0].id });
        setListWard(dataWard);

        let item = dataWard.find((item) => item.name === getSplitAddress()[2]);
        if (item) setSelectID({ ...selectID, ward: item.id })
    }

    //Handle event change 
    function onChangeProvince(event: SelectChangeEvent): void {
        setIsEdited(true);
        setSelectID({ ...selectID, province: parseInt(event.target.value) });
        let province = listProvince.find((item) => item.id === parseInt(event.target.value));
        let textArray = getSplitAddress();
        province && (textArray[0] = province?.name);
        let str = textArray.join('-');
        setTextAddress(str);
        setAddress(str);
    }

    function onChangeDistrict(event: SelectChangeEvent): void {
        setIsEdited(true);
        setSelectID({ ...selectID, district: parseInt(event.target.value) });

        let district = listDistrict.find((item) => item.id === parseInt(event.target.value));
        let textArray = getSplitAddress();
        district && (textArray[1] = district?.name);
        let str = textArray.join('-');
        setTextAddress(str);
        setAddress(str);
    }

    function isHas(list: any[], id: number): boolean {
        let item = list.find((item) => item.id === id);
        return item !== undefined;
    }

    function onChangeWard(event: SelectChangeEvent): void {
        setIsEdited(true);
        setSelectID({ ...selectID, ward: parseInt(event.target.value) });

        let ward = listWard.find((item) => item.id === parseInt(event.target.value));
        let textArray = getSplitAddress();
        ward && (textArray[2] = ward?.name);
        let str = textArray.join('-');
        setTextAddress(str);
        setAddress(str);
    }

    return (
        <div className="address-option">
            <FormControl fullWidth size="small">
                <InputLabel id='province' className="title-select">Tỉnh/TP</InputLabel>
                <Select
                    label="province"
                    className="select-address"
                    value={(listProvince.length ? `${selectID.province}` : '')}
                    onChange={onChangeProvince}
                    disabled={disabled}
                >
                    {listProvince.map((item, index) => <MenuItem value={item.id} key={index}>{item.name}</MenuItem>)}

                </Select>
            </FormControl>

            <FormControl fullWidth size="small">
                <InputLabel id='province' className="title-select">Quận/Huyện</InputLabel>
                <Select
                    label="district"
                    className="select-address"
                    value={loadDistrict ? '0' : (selectID.district >= 0 && isHas(listDistrict, selectID.district) ? `${selectID.district}` : listDistrict[0] ? `${listDistrict[0].id}` : '')}
                    onChange={onChangeDistrict}
                    disabled={disabled}
                >
                    {!loadDistrict && listDistrict.map((item, index) => <MenuItem value={item.id} key={index}>{item.name}</MenuItem>)}
                    {loadDistrict && <MenuItem value={0}>loading... </MenuItem>}
                </Select>
            </FormControl>

            <FormControl fullWidth size="small">
                <InputLabel id='province' className="title-select">Phường/Xã</InputLabel>
                <Select
                    label="ward"
                    className="select-address"
                    value={loadWard ? '0' : (selectID.ward >= 0 && isHas(listWard, selectID.ward) ? `${selectID.ward}` : listWard[0] ? `${listWard[0].id}` : '')}
                    onChange={onChangeWard}
                    disabled={disabled}

                >
                    {!loadWard && listWard.map((item, index) => <MenuItem value={item.id} key={index}>{item.name}</MenuItem>)}
                    {loadWard && <MenuItem value={0}>loading... </MenuItem>}
                </Select>
            </FormControl>
        </div>
    )
}