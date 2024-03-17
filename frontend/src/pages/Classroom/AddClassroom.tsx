import { Button, Dialog, DialogContent, FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import UntilsFunction, { Transition } from "../../utils/UtilsFunction";
import { useEffect, useState } from "react";
import InputValid from "../../components/InputValid";
import AxiosClient from "../../api/AxiosClient";
import { ClassroomType } from "../../utils/DataType";
type Form = {
    label: string,
    capacity: number,
    is_computer_room: number
}

const initForm: Form = {
    label: "",
    capacity: 1,
    is_computer_room: 0
}

const initValid = {
    label: false,
    capacity: false,
    is_computer_room: false
}

type props = {
    add: Function,
    open: boolean,
    setOpen: Function
}
export default function AddClassroom({ add, open, setOpen }: props) {
    const [dataForm, setDataForm] = useState<Form>(initForm);
    const [validForm, setValidForm] = useState<any>(initValid);

    useEffect(() => {
        setValidForm({
            label: dataForm.label.length > 0,
            capacity: dataForm.capacity > 0,
            is_computer_room: true
        })
    }, [dataForm])

    function onChangeData(name: string, value: string): void {
        if (name === "capacity") {
            let reg = /^\d+$/;
            if (reg.test(value)) setDataForm({ ...dataForm, capacity: parseInt(value) });
        } else
            setDataForm({ ...dataForm, [name]: value });
    }

    function onChangeSelect(event: SelectChangeEvent<number>): void {
        setDataForm({ ...dataForm, is_computer_room: parseInt(`${event.target.value}`) });
    }

    function onSubmit(): void {
        AxiosClient.post('classrooms', dataForm).then((data) => {
            let lec: ClassroomType = data.data.data;
            add(lec);
            UntilsFunction.showToastSuccess('Thêm phòng thành công!');
            setTimeout(() => {
                setOpen(false);
            }, 1000)

        }).catch((e) => {
            UntilsFunction.showToastError(`Lỗi: ${e.message}`);
        })
    }

    return (
        <Dialog
            open={open}
            keepMounted
            TransitionComponent={Transition}
            fullWidth={true}
            maxWidth='sm'
            onClose={() => { setOpen(false) }}
        >
            <DialogContent className="dialog-account">
                <div className="dialog-account--title">Thêm phòng</div>
                <div className="grid grid-cols-2 mt-4 w-full gap-y-4 gap-x-4">
                    <InputValid
                        label={"Mã phòng"} name={"label"}
                        onChangeData={onChangeData} value={dataForm.label}
                        isValid={validForm.label} alert={"Mã phòng không hợp lệ"} disabled={false} />

                    <InputValid
                        label={"Số lượng"} name={"capacity"}
                        onChangeData={onChangeData} value={`${dataForm.capacity}`}
                        isValid={dataForm.capacity > 0} alert={"Số lượng không hợp lệ"} disabled={false} />
                </div>
                <div className="w-full mt-4">
                    <div className="input-valid__label flex">
                        <label htmlFor=""> Loại phòng:  </label>
                    </div>
                    <div className="w-full">
                        <FormControl fullWidth size="small">
                            <Select
                                className="select-address"
                                value={dataForm.is_computer_room}
                                onChange={onChangeSelect}
                            >
                                <MenuItem value={1}>Phòng máy</MenuItem>
                                <MenuItem value={0}>Phòng học</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </DialogContent>
            <div className="p-4 w-full flex justify-end">
                <Button variant="contained" onClick={onSubmit}> Thêm phòng</Button>
            </div>
        </Dialog>
    )
}