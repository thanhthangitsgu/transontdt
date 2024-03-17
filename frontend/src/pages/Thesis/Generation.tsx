import { Button, Dialog, DialogContent, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from "dayjs";
import InputValid from "../../components/InputValid";
import { useEffect, useState } from "react";
import { ClassroomType } from "../../utils/DataType";
import useGet from "../../hook/useGet";
import { LoadingButton } from "@mui/lab";
import EditNoteIcon from '@mui/icons-material/EditNote';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';

type Lecturer = {
    id: string,
    name: string
}


type props = {
    open: boolean,
    setOpen: Function,
    generate: Function,
    number: number,
    listLecturer: Lecturer[]
}

export default function Generation({ open, setOpen, generate, number, listLecturer }: props) {
    const [listRoom, setListRoom] = useState<string[]>([]);
    const [dataRoom, setDataRoom] = useState<ClassroomType[]>([]);
    const fetchRoom = useGet('classrooms', false);
    const [startTime, setStartTime] = useState<dayjs.Dayjs | null>(dayjs().startOf('day').add(7, 'hour'));
    const [load, setLoad] = useState<boolean>(false);
    const [minutes, setMinutes] = useState<string>('10');
    const [itemList, setItemList] = useState(listLecturer);

    useEffect(() => {
        setItemList(listLecturer);
    }, [listLecturer])

    const handleDrop = (droppedItem: any) => {
        if (!droppedItem.destination) return;
        var updatedList = [...itemList];
        const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
        updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
        setItemList(updatedList);
    };

    useEffect(() => {
        setListRoom([]);
    }, [open])

    useEffect(() => {
        fetchRoom.response && setDataRoom(fetchRoom.response);
    }, [fetchRoom.response]);

    const handleChange = (event: SelectChangeEvent<typeof listRoom>) => {
        const {
            target: { value },
        } = event;
        setListRoom(typeof value === 'string' ? value.split(',') : value,);
    };

    function onSubmit(): void {
        setLoad(true);
        generate(listRoom.length, startTime, listRoom, () => {
            setLoad(false);
        }, parseInt(minutes), itemList);
    }

    function onChangeData(name: string, value: string): void {
        let reg = /^\d+$/;
        if (value.length > 0 && !reg.test(value)) return;
        setMinutes(value);
    }

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth='sm'
            onClose={() => setOpen(false)}
        >
            <DialogContent>
                <div className="dialog-account--title">Tạo lịch bảo vệ khóa luận</div>
                <div className="flex mt-4 gap-8">
                    <div className="w-1/2 ">
                        <InputValid label={"Số lượng khóa luận"} name={""} onChangeData={() => { }} value={`${number}`} isValid={false} alert={""} disabled={true} /> </div>
                    <div className="w-1/2">
                        <div className="input-valid mt-2">
                            <div className="input-valid__label flex">
                                <label htmlFor=""> Ngày bắt đầu:  </label>
                            </div>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker className="date-picker" format="DD/MM/YYYY" value={startTime} minDate={dayjs()} onChange={(value) => setStartTime(value)} />
                            </LocalizationProvider>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                    <div className="input-valid mt-2">
                        <div className="input-valid__label flex">
                            <label htmlFor=""> Giờ bắt đầu:  </label>
                        </div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimeField
                                format="HH:mm"
                                className="date-picker"
                                onChange={(value) => setStartTime(value)}
                                value={startTime}
                            />
                        </LocalizationProvider>
                    </div>
                    <div>
                        <InputValid label={"Số phút: "} name={"minutes"} onChangeData={onChangeData} value={minutes} isValid={minutes.length > 0 && parseInt(minutes) >= 10} alert={"Tối thiểu 10 phút"} disabled={false} />                    </div>
                </div>
                <div className="input-valid mt-2">
                    <div className="input-valid__label flex">
                        <label htmlFor=""> Phòng: {`(${listRoom.length})`} </label>
                    </div>
                    <div>
                        <FormControl fullWidth>
                            <Select
                                multiple
                                value={listRoom}
                                onChange={handleChange}
                                size="small"
                            >
                                {dataRoom.map((room) => (
                                    <MenuItem
                                        key={room.label}
                                        value={room.label}
                                    >
                                        {room.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <div className="flex w-full mt-4 justify-end">
                    <LoadingButton
                        loading={load}
                        loadingPosition="start"
                        startIcon={<EditNoteIcon />}
                        variant="contained"
                        onClick={onSubmit}
                        disabled={listRoom.length === 0 || minutes.length === 0 || parseInt(minutes) < 10}
                    >
                        Tạo lịch
                    </LoadingButton>

                </div>
            </DialogContent>
        </Dialog>
    )
}