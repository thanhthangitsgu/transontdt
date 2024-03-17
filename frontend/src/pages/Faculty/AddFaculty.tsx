import { Button, Dialog, DialogContent } from "@mui/material";
import UntilsFunction, { Transition } from "../../utils/UtilsFunction";
import { useEffect, useState } from "react";
import InputValid from "../../components/InputValid";
import AxiosClient from "../../api/AxiosClient";
import { FacultyType } from "../../utils/DataType";
type Form = {
    faculty_id: string,
    name: string,
    email: string,
    phone: string
}

const initForm: Form = {
    faculty_id: "",
    name: "",
    email: "",
    phone: ""
}

const initValid = {
    faculty_id: false,
    name: false,
    email: false,
    phone: false
}

type props = {
    add: Function,
    open: boolean,
    setOpen: Function
}
export default function AddFaculty({ add, open, setOpen }: props) {
    const [dataForm, setDataForm] = useState<Form>(initForm);
    const [validForm, setValidForm] = useState<any>(initValid);

    useEffect(() => {
        setValidForm({
            faculty_id: dataForm.faculty_id.length > 0,
            name: dataForm.name.length > 0,
            email: UntilsFunction.isValidEmail(dataForm.email),
            phone: UntilsFunction.isValidPhone(dataForm.phone)
        })
    }, [dataForm])

    function onChangeData(name: string, value: string): void {
        setDataForm({ ...dataForm, [name]: value })
    }

    function onSubmit(): void {
        AxiosClient.post('faculties', dataForm).then((data) => {
            let lec: FacultyType = data.data.data;
            add(lec);
            UntilsFunction.showToastSuccess('Thêm khoa thành công!');
            setTimeout(() => {
                setOpen(false);
            }, 1000)

        }).catch((e) => {
            UntilsFunction.showToastError('Đã có lỗi xảy ra');
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
                <div className="dialog-account--title">Thêm khoa</div>
                <div className="grid grid-cols-2 mt-4 w-full gap-y-4 gap-x-4">
                    <InputValid
                        label={"Mã khoa"} name={"faculty_id"}
                        onChangeData={onChangeData} value={dataForm.faculty_id}
                        isValid={validForm.faculty_id} alert={"Mã khoa không hợp lệ"} disabled={false} />

                    <InputValid
                        label={"Tên khoa"} name={"name"}
                        onChangeData={onChangeData} value={dataForm.name}
                        isValid={validForm.name} alert={"Mã khoa không hợp lệ"} disabled={false} />

                    <InputValid
                        label={"Email"} name={"email"}
                        onChangeData={onChangeData} value={dataForm.email}
                        isValid={validForm.email} alert={"Email không hợp lệ"} disabled={false} />

                    <InputValid
                        label={"Số điện thoại"} name={"phone"}
                        onChangeData={onChangeData} value={dataForm.phone}
                        isValid={validForm.phone} alert={"Số điện thoại không hợp lệ"} disabled={false} />
                </div>
            </DialogContent>
            <div className="p-4 w-full flex justify-end">
                <Button variant="contained" onClick={onSubmit}> Thêm khoa</Button>
            </div>
        </Dialog>
    )
}