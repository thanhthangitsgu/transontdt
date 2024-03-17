import { Button, Dialog, DialogContent, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import InputValid from "../../components/InputValid";
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import UntilsFunction from "../../utils/UtilsFunction";
import AxiosClient from "../../api/AxiosClient";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { LecturerType } from "../../utils/DataType";
import { useEffect, useState } from "react";

type props = {
    open: boolean,
    setOpen: Function,
    detail: DataRequest,
    callBack: Function,
}

type DataRequest = {
    room: number,
    label: string,
    day: number,
    time: number,
    detail: string,
    id_time: number[],
    session: number,
    empty: string[]
}

export default function PopupRequest({ open, setOpen, detail, callBack }: props) {
    const profile = useSelector<RootState, LecturerType>(state => state.profile);
    const [note, setNote] = useState<string>('');
    const [listHour, setListHour] = useState<string[]>([]);
    const [dataHour, setDataHour] = useState<string[]>([]);

    useEffect(() => {
        setListHour([]);
        setDataHour([]);
        let morning: string[] = [];
        let evening: string[] = [];
        for (let i = 0; i < 5; i++) {
            morning.push(`${i + 1}`);
            evening.push(`${i + 6}`);
        };

        // if (detail.session) setDataHour(evening); else setDataHour(morning);
        console.log(detail.day);
        setDataHour(detail.empty);

    }, [detail, open])

    function handleSubmit(): void {
        setOpen(false);
        let list: number[] = [];
        console.log(listHour);
        listHour.map((item) => list.push(detail.id_time[parseInt(item) > 5 ? parseInt(item) - 6 : parseInt(item) - 1]));
        AxiosClient.post(`classroom-time`, {
            classroom_id: detail.room,
            list_id_time: list,
            note: note,
            lecturer_id: profile.lecturer_id,
            status: 0
        }).then(() => {
            UntilsFunction.showToastSuccess('Đăng ký mượn phòng thành công!');
            callBack();
        })
    }

    function onChangeNote(name: string, value: string): void {
        setNote(value);
    }

    const handleChange = (event: SelectChangeEvent<typeof listHour>) => {
        const {
            target: { value },
        } = event;
        setListHour(typeof value === 'string' ? value.split(',') : value);
    };


    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth='sm'
            onClose={() => {
                setOpen(false);
            }}
        >
            <DialogContent>
                <div className="dialog-account--title">Đăng ký mượn phòng</div>
                <div className="mt-8">
                    <div className="grid grid-cols-2 gap-4">
                        <InputValid label={"Phòng"} name={"phòng"} onChangeData={() => { }} value={detail.label} isValid={false} alert={""} disabled={true} />
                        <div className="mt-2">
                            <div className="input-valid__label flex">
                                <label htmlFor=""> Thời gian </label>
                            </div>

                            <div>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Tiết</InputLabel>
                                    <Select
                                        label='Tiết'
                                        multiple
                                        value={listHour}
                                        onChange={handleChange}
                                    >
                                        {dataHour.map((text) => (
                                            <MenuItem
                                                key={text}
                                                value={text}
                                            >
                                                {text}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <InputValid label={"Ngày"} name={"phòng"} onChangeData={() => { }} value={detail.detail} isValid={false} alert={""} disabled={true} />
                        <InputValid label={"Lí do"} name={"note"} onChangeData={onChangeNote} value={note} isValid={false} alert={""} disabled={false} />
                    </div>

                </div>
                <div className="flex w-full mt-8 justify-end">
                    <Button startIcon={<LayersRoundedIcon />} variant="contained" onClick={handleSubmit}>
                        Xác nhận
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}