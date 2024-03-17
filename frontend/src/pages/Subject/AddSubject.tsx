import { Button, Dialog, DialogContent, FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import UntilsFunction, { Transition } from "../../utils/UtilsFunction";
import { useEffect, useState } from "react";
import InputValid from "../../components/InputValid";
import AxiosClient from "../../api/AxiosClient";
import { MajorType, SubjectType } from "../../utils/DataType";
import useGet from "../../hook/useGet";
type Form = {
    subject_id: string,
    name: string,
    no_credit: number,
    major_id: number
}

const initForm: Form = {
    subject_id: "",
    name: "",
    no_credit: 0,
    major_id: -1
}

const initValid = {
    subject_id: false,
    name: false,
    email: false,
    phone: false
}

type props = {
    add: Function,
    open: boolean,
    setOpen: Function
}
export default function AddSubject({ add, open, setOpen }: props) {
    const [dataForm, setDataForm] = useState<Form>(initForm);
    const [validForm, setValidForm] = useState<any>(initValid);
    const [listLocalMajor, setListLocalMajor] = useState<MajorType[]>([]);

    const dataMajor = useGet('majors', false);

    useEffect(() => {
        setValidForm({
            subject_id: dataForm.subject_id.length > 0,
            name: dataForm.name.length > 0,
            no_credit: true,
            major: true
        })
    }, [dataForm]);

    useEffect(() => {
        if (!dataMajor.response) return;
        setListLocalMajor(dataMajor.response);
    }, [dataMajor.response]);


    function onChangeData(name: string, value: string): void {
        setDataForm({ ...dataForm, [name]: value })
    }

    function onSubmit(): void {
        AxiosClient.post('subjects', dataForm).then((data) => {
            let lec: SubjectType = data.data.data;
            add(lec);
            UntilsFunction.showToastSuccess('Thêm môn học thành công!');
            setTimeout(() => {
                setOpen(false);
            }, 1000)

        }).catch((e) => {
            UntilsFunction.showToastError('Đã có lỗi xảy ra');
        })
    }

    function onChangeSelect(event: SelectChangeEvent<number>): void {
        setDataForm({ ...dataForm, major_id: parseInt(`${event.target.value}`) });
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
                <div className="dialog-account--title">Thêm môn học</div>
                <div className="grid grid-cols-2 mt-4 w-full gap-y-4 gap-x-4">
                    <InputValid
                        label={"Mã môn"} name={"subject_id"}
                        onChangeData={onChangeData} value={dataForm.subject_id}
                        isValid={validForm.subject_id} alert={"Mã khoa không hợp lệ"} disabled={false} />

                    <InputValid
                        label={"Tên môn"} name={"name"}
                        onChangeData={onChangeData} value={dataForm.name}
                        isValid={validForm.name} alert={"Mã khoa không hợp lệ"} disabled={false} />

                    <InputValid
                        label={"Số tín chỉ"} name={"no_credit"}
                        onChangeData={onChangeData} value={`${dataForm.no_credit}`}
                        isValid={validForm.no_credit} alert={"Email không hợp lệ"} disabled={false} />

                    <div className="input-valid mt-2">
                        <div className="input-valid__label flex">
                            <label htmlFor=""> Chuyên ngành:  </label>
                        </div>
                        <FormControl fullWidth size="small">
                            <Select
                                className="select-address"
                                sx={{ width: '14.5rem' }}
                                name='major_id'
                                onChange={onChangeSelect}
                                value={dataForm.major_id}
                            >
                                <MenuItem value={-1}>Chọn ngành</MenuItem>
                                {listLocalMajor.map((item, index) => <MenuItem value={item.id} key={index}>{item.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </div>


                </div>
            </DialogContent>
            <div className="p-4 w-full flex justify-end">
                <Button variant="contained" onClick={onSubmit}> Thêm môn học</Button>
            </div>
        </Dialog>
    )
}