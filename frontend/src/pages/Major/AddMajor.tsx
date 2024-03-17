import { Button, Dialog, DialogContent, FormControl, InputLabel, Menu, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import UntilsFunction, { Transition } from "../../utils/UtilsFunction";
import { ChangeEvent, useEffect, useState } from "react";
import InputValid from "../../components/InputValid";
import AxiosClient from "../../api/AxiosClient";
import { FacultyType, MajorType } from "../../utils/DataType";
import useGet from "../../hook/useGet";
type Form = {
    faculty_id: number,
    name: string,
    major_id: string
}

const initForm: Form = {
    faculty_id: -1,
    name: "",
    major_id: ""
}

const initValid = {
    faculty_id: false,
    name: false,
    major_id: false
}

type props = {
    add: Function,
    open: boolean,
    setOpen: Function
}
export default function AddMajor({ add, open, setOpen }: props) {
    const [dataForm, setDataForm] = useState<Form>(initForm);
    const [validForm, setValidForm] = useState<any>(initValid);
    const [listFaculty, setListFaculty] = useState<FacultyType[]>([]);
    const dataFaculty = useGet('faculties', false);

    useEffect(() => {
        dataFaculty.response && setListFaculty(dataFaculty.response)
    }, [dataFaculty.response])

    useEffect(() => {
        setValidForm({
            faculty_id: dataForm.faculty_id >= 0,
            name: dataForm.name.length > 0,
            major_id: dataForm.major_id.length > 0
        })
    }, [dataForm])

    function onChangeData(name: string, value: string): void {
        setDataForm({ ...dataForm, [name]: value })
    }

    function onSubmit(): void {
        AxiosClient.post('majors', dataForm).then((data) => {
            let lec: MajorType = data.data.data;
            add(lec);
            UntilsFunction.showToastSuccess('Thêm ngành thành công!');
            setTimeout(() => {
                setOpen(false);
            }, 200)

        }).catch((e) => {
            UntilsFunction.showToastError('Đã có lỗi xảy ra');
        })
    }

    function onChangeFaculty(event: SelectChangeEvent<number>) {
        setDataForm({ ...dataForm, faculty_id: parseInt(`${event.target.value}`) });
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
                <div className="dialog-account--title">Thêm ngành</div>
                <div className="mt-4">
                    <FormControl fullWidth>
                        <InputLabel >Khoa</InputLabel>
                        <Select
                            defaultValue={-1}
                            value={dataForm.faculty_id}
                            label="Khoa"
                            onChange={onChangeFaculty}
                            size="small"
                        >
                            <MenuItem value={-1}> Chọn</MenuItem>
                            {listFaculty.map((item, index) => <MenuItem value={item.id}> {`(${item.faculty_id}) ${item.name}`}</MenuItem>)}
                        </Select>

                    </FormControl>
                </div>
                <div className="grid grid-cols-2 mt-4 w-full gap-y-4 gap-x-4">
                    <InputValid
                        label={"Mã ngành"} name={"major_id"}
                        onChangeData={onChangeData} value={dataForm.major_id}
                        isValid={validForm.faculty_id} alert={"Mã ngành không hợp lệ"} disabled={false} />

                    <InputValid
                        label={"Tên ngành"} name={"name"}
                        onChangeData={onChangeData} value={dataForm.name}
                        isValid={validForm.name} alert={"Tên ngành không hợp lệ"} disabled={false} />
                </div>
            </DialogContent>
            <div className="p-4 w-full flex justify-end">
                <Button variant="contained" onClick={onSubmit} disabled={!UntilsFunction.isValidForm(validForm)}> Thêm ngành</Button>
            </div>
        </Dialog>
    )
}